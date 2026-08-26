import Event from '../models/Event.js';

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, status, search } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (status) filter.status = status;
    if (search) {
      const safe = escapeRegex(search);
      filter.$or = [
        { title: { $regex: safe, $options: 'i' } },
        { venue: { $regex: safe, $options: 'i' } },
        { location: { $regex: safe, $options: 'i' } },
        { category: { $regex: safe, $options: 'i' } },
      ];
    }

    const total = await Event.countDocuments(filter);
    const events = await Event.find(filter)
      .sort({ date: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('createdBy', 'name email')
      .populate('assignedEmployees');

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      events,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedEmployees');
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
    const event = await Event.create({
      ...req.body,
      createdBy: req.user.id,
      availableSeats: req.body.capacity || 100,
      status: req.body.status || 'upcoming',
      images: req.body.images || [],
      assignedEmployees: req.body.assignedEmployees || [],
    });
    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getEventStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: 'upcoming' });
    const activeEvents = await Event.countDocuments({ status: 'active' });
    const completedEvents = await Event.countDocuments({ status: 'completed' });
    const cancelledEvents = await Event.countDocuments({ status: 'cancelled' });

    res.status(200).json({
      success: true,
      totalEvents,
      upcomingEvents,
      activeEvents,
      completedEvents,
      cancelledEvents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
