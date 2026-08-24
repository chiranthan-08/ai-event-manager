import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

export const getEvents = async (req, res) => {
  try {
    const {
      category,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      search,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (minPrice || maxPrice) {
      filter.ticketPrice = {};
      if (minPrice) filter.ticketPrice.$gte = Number(minPrice);
      if (maxPrice) filter.ticketPrice.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Event.countDocuments(filter);
    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignedEmployees', 'name email')
      .sort({ date: 1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      events,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email phone')
      .populate('assignedEmployees', 'name email phone');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      capacity,
      ticketPrice,
      images,
      requirements,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      venue,
      capacity,
      ticketPrice,
      images,
      requirements,
      createdBy: req.user.id,
      availableSeats: capacity,
    });

    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (req.user.role === 'admin') {
      // Admin can update anything
    } else if (req.user.role === 'employee') {
      const isAssigned = event.assignedEmployees.some(
        (emp) => emp.toString() === req.user.id
      );
      if (!isAssigned && event.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
      }
    } else {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (req.body.capacity && req.body.capacity !== event.capacity) {
      const bookedSeats = event.capacity - event.availableSeats;
      req.body.availableSeats = Math.max(0, req.body.capacity - bookedSeats);
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy', 'name email')
      .populate('assignedEmployees', 'name email');

    res.status(200).json({ success: true, event: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const activeRegistrations = await Registration.countDocuments({
      event: req.params.id,
      status: { $in: ['confirmed', 'pending'] },
    });

    if (activeRegistrations > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete event with ${activeRegistrations} active registration(s). Cancel them first.`,
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getEventStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();

    const eventsByStatus = await Event.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const upcomingCount = await Event.countDocuments({
      date: { $gte: new Date() },
      status: 'upcoming',
    });

    const eventsByCategory = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalEvents,
        upcomingCount,
        eventsByStatus: eventsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        eventsByCategory,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
