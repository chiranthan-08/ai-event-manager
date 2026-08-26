import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import Employee from '../models/Employee.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';

const MAX_EVENTS_PER_DAY = 3;

export const createRegistration = async (req, res) => {
  try {
    const { eventId, numberOfSeats, organizerId, addOns = [] } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Event has been cancelled' });
    }

    if (event.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Event has already ended' });
    }

    if (event.availableSeats < numberOfSeats) {
      return res.status(400).json({ success: false, message: `Only ${event.availableSeats} seat(s) available` });
    }

    let assignedOrganizer = null;
    if (organizerId) {
      assignedOrganizer = await User.findById(organizerId);
      if (!assignedOrganizer || assignedOrganizer.role !== 'employee') {
        return res.status(400).json({ success: false, message: 'Invalid organizer' });
      }
    } else if (event.assignedEmployees?.length > 0) {
      const emp = await Employee.findById(event.assignedEmployees[0]);
      if (emp) assignedOrganizer = await User.findById(emp.user);
    }

    if (assignedOrganizer) {
      const eventDate = new Date(event.date);
      const dayStart = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const emp = await Employee.findOne({ user: assignedOrganizer._id });
      if (emp) {
        const eventsOnDate = await Event.find({
          _id: { $in: emp.assignedEvents || [] },
          date: { $gte: dayStart, $lt: dayEnd },
          status: { $ne: 'cancelled' },
        });

        if (eventsOnDate.length >= MAX_EVENTS_PER_DAY) {
          return res.status(400).json({
            success: false,
            message: `Organizer has reached the maximum of ${MAX_EVENTS_PER_DAY} events on this date. Please join the waiting list.`,
          });
        }
      }
    }

    const existing = await Registration.findOne({
      client: userId,
      event: eventId,
      status: { $in: ['active', 'pending'] },
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have an active registration for this event' });
    }

    const ticketId = 'TKT-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const eventTotal = event.ticketPrice * numberOfSeats;
    const addOnsTotal = addOns.reduce((sum, a) => sum + (a.price || 0) * (a.quantity || 1), 0);
    const totalAmount = eventTotal + addOnsTotal;

    const registration = await Registration.create({
      client: userId,
      event: eventId,
      organizer: assignedOrganizer?._id || null,
      numberOfTickets: numberOfSeats,
      totalAmount,
      ticketId,
      status: 'active',
      addOns: addOns.map(a => ({
        name: a.name,
        price: a.price,
        quantity: a.quantity || 1,
        category: a.category,
        unit: a.unit || 'fixed',
      })),
      addOnsTotal,
    });

    await Event.findByIdAndUpdate(eventId, { $inc: { availableSeats: -numberOfSeats } });

    await Payment.create({
      client: userId,
      event: eventId,
      registration: registration._id,
      amount: totalAmount,
      paymentStatus: 'successful',
      paidAt: new Date(),
      paymentId: 'PAY-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
    });

    const populated = await Registration.findById(registration._id).populate('event');

    res.status(201).json({ success: true, registration: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getMyRegistrations = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const total = await Registration.countDocuments({ client: req.user.id });
    const registrations = await Registration.find({ client: req.user.id })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('event')
      .populate('client', 'name email');

    res.status(200).json({
      success: true,
      count: registrations.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      registrations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    if (registration.client.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Registration is already cancelled' });
    }

    const event = await Event.findById(registration.event);
    const eventDate = event ? new Date(event.date) : new Date();
    const hoursUntilEvent = (eventDate - new Date()) / (1000 * 60 * 60);

    if (hoursUntilEvent <= 48 && req.user.role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot cancel registration less than 48 hours before the event' });
    }

    const refundEligible = hoursUntilEvent > 48;

    await Registration.findByIdAndUpdate(req.params.id, {
      status: 'cancelled',
      refundEligible,
    });

    if (event) {
      await Event.findByIdAndUpdate(event._id, { $inc: { availableSeats: registration.numberOfTickets } });
    }

    const updated = await Registration.findById(req.params.id).populate('event');

    res.status(200).json({ success: true, message: 'Registration cancelled successfully', refundEligible, registration: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const filter = { event: eventId };
    if (status) filter.status = status;

    const total = await Registration.countDocuments(filter);
    const registrations = await Registration.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('client', 'name email');

    res.status(200).json({
      success: true,
      count: registrations.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      registrations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getAllRegistrations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;

    let query = Registration.find(filter);
    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matchingClients = await (await import('../models/User.js')).default.find({ name: { $regex: safe, $options: 'i' } }).select('_id');
      const matchingEvents = await (await import('../models/Event.js')).default.find({ title: { $regex: safe, $options: 'i' } }).select('_id');
      filter.$or = [
        { client: { $in: matchingClients.map(c => c._id) } },
        { event: { $in: matchingEvents.map(e => e._id) } },
        { ticketId: { $regex: safe, $options: 'i' } },
      ];
      query = Registration.find(filter);
    }

    const total = await Registration.countDocuments(filter);
    const registrations = await query
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('client', 'name email')
      .populate('event', 'title date venue category');

    res.status(200).json({
      success: true,
      count: registrations.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      registrations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
