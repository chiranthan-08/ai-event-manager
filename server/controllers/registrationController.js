import db from '../utils/memoryDb.js';

export const createRegistration = async (req, res) => {
  try {
    const { eventId, numberOfSeats } = req.body;
    const userId = req.user.id;

    const event = db.findEventById(eventId);
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

    const existingRegistrations = db.findRegistrations({
      user: userId,
      event: eventId,
      status: 'confirmed',
    });
    const pendingRegistrations = db.findRegistrations({
      user: userId,
      event: eventId,
      status: 'pending',
    });
    const existing = [...existingRegistrations, ...pendingRegistrations];
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active registration for this event',
      });
    }

    const ticketId = 'TKT-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const totalAmount = event.ticketPrice * numberOfSeats;

    const registration = db.createRegistration({
      user: userId,
      event: eventId,
      numberOfSeats,
      totalAmount,
      ticketId,
      status: 'pending',
    });

    db.updateEvent(eventId, {
      availableSeats: event.availableSeats - numberOfSeats,
    });

    res.status(201).json({ success: true, registration });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getMyRegistrations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allRegistrations = db.findRegistrations({ user: req.user.id });
    const sorted = allRegistrations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = sorted.length;
    const skip = (Number(page) - 1) * Number(limit);
    const registrations = sorted.slice(skip, skip + Number(limit));

    const enriched = registrations.map((reg) => {
      const event = reg.event ? db.findEventById(reg.event) : null;
      return { ...reg, event };
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      registrations: enriched,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const cancelRegistration = async (req, res) => {
  try {
    const registration = db.findRegistrationById(req.params.id);

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    if (registration.user !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Registration is already cancelled' });
    }

    const event = db.findEventById(registration.event);
    const eventDate = event ? new Date(event.date) : new Date();
    const hoursUntilEvent = (eventDate - new Date()) / (1000 * 60 * 60);

    if (hoursUntilEvent <= 48 && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel registration less than 48 hours before the event',
      });
    }

    const refundEligible = hoursUntilEvent > 48;

    db.updateRegistration(req.params.id, {
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      refundEligible,
    });

    if (event) {
      db.updateEvent(event._id || event.id, {
        availableSeats: event.availableSeats + registration.numberOfSeats,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully',
      refundEligible,
      registration: db.findRegistrationById(req.params.id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const event = db.findEventById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const filter = { event: eventId };
    if (status) filter.status = status;

    let registrations = db.findRegistrations(filter);
    registrations = registrations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = registrations.length;
    const skip = (Number(page) - 1) * Number(limit);
    const paginated = registrations.slice(skip, skip + Number(limit));

    const enriched = paginated.map((reg) => {
      const user = db.findUserById(reg.user);
      return { ...reg, user: user ? { name: user.name, email: user.email, phone: user.phone } : null };
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      registrations: enriched,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
