import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

export const createRegistration = async (req, res) => {
  try {
    const { eventId, numberOfSeats } = req.body;
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

    const existing = await Registration.findOne({
      client: userId,
      event: eventId,
      status: { $in: ['active', 'pending'] },
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have an active registration for this event' });
    }

    const ticketId = 'TKT-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const totalAmount = event.ticketPrice * numberOfSeats;

    const registration = await Registration.create({
      client: userId,
      event: eventId,
      numberOfTickets: numberOfSeats,
      totalAmount,
      ticketId,
      status: 'active',
    });

    await Event.findByIdAndUpdate(eventId, { $inc: { availableSeats: -numberOfSeats } });

    res.status(201).json({ success: true, registration });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getMyRegistrations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const total = await Registration.countDocuments({ client: req.user.id });
    const registrations = await Registration.find({ client: req.user.id })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('event');

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
