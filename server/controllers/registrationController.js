import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import { generateTicketId, calculateRefundEligibility } from '../utils/helpers.js';

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
      return res.status(400).json({
        success: false,
        message: `Only ${event.availableSeats} seat(s) available`,
      });
    }

    const existingRegistration = await Registration.findOne({
      user: userId,
      event: eventId,
      status: { $in: ['confirmed', 'pending'] },
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active registration for this event',
      });
    }

    const ticketId = generateTicketId();
    const totalAmount = event.ticketPrice * numberOfSeats;

    const registration = await Registration.create({
      user: userId,
      event: eventId,
      numberOfSeats,
      totalAmount,
      ticketId,
      status: 'pending',
    });

    event.availableSeats -= numberOfSeats;
    await event.save();

    const populated = await Registration.findById(registration._id)
      .populate('event', 'title date venue ticketPrice');

    res.status(201).json({ success: true, registration: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getMyRegistrations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = { user: req.user.id };
    const total = await Registration.countDocuments(filter);

    const registrations = await Registration.find(filter)
      .populate('event', 'title date venue category ticketPrice images status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

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
    const registration = await Registration.findById(req.params.id)
      .populate('event', 'date title');

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    if (registration.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Registration is already cancelled' });
    }

    const eventDate = new Date(registration.event.date);
    const hoursUntilEvent = (eventDate - new Date()) / (1000 * 60 * 60);

    if (hoursUntilEvent <= 48 && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel registration less than 48 hours before the event',
      });
    }

    const refundEligible = calculateRefundEligibility(eventDate);

    registration.status = 'cancelled';
    registration.cancelledAt = new Date();
    registration.refundEligible = refundEligible;
    await registration.save();

    const event = await Event.findById(registration.event._id);
    if (event) {
      event.availableSeats += registration.numberOfSeats;
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully',
      refundEligible,
      registration,
    });
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

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Registration.countDocuments(filter);

    const registrations = await Registration.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

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
