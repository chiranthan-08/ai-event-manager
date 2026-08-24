import db from '../utils/memoryDb.js';

export const getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, status, search } = req.query;
    const events = db.findEvents({ category, status, search });
    const total = events.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginatedEvents = events.slice(startIndex, startIndex + Number(limit));

    res.status(200).json({
      success: true,
      count: paginatedEvents.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      events: paginatedEvents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = db.findEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createEvent = async (req, res) => {
  try {
    const event = db.createEvent({
      ...req.body,
      createdBy: req.user.id,
      availableSeats: req.body.capacity || 100,
      status: req.body.status || 'upcoming',
      images: req.body.images || [],
      assignedEmployees: req.body.assignedEmployees || [],
    });
    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = db.updateEvent(req.params.id, req.body);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const deleted = db.deleteEvent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getEventStats = async (req, res) => {
  try {
    const stats = db.getStats();
    res.status(200).json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
