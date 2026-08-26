import Event from '../models/Event.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Registration from '../models/Registration.js';
import WaitingList from '../models/WaitingList.js';
import Payment from '../models/Payment.js';
import jwt from 'jsonwebtoken';

const MAX_EVENTS_PER_DAY = 3;
const JWT_SECRET = process.env.JWT_SECRET || 'ai-event-manager-secret-key-2026';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

const getOrCreateEmployee = async (userId) => {
  let employee = await Employee.findOne({ user: userId });
  if (!employee) {
    const user = await User.findById(userId);
    if (!user) return null;
    employee = await Employee.create({
      user: userId,
      name: user.name,
      role: 'Event Organizer',
      specialization: 'General Events',
      experience: 1,
      bio: 'Professional Event Organizer',
      assignedEvents: [],
    });
  }
  return employee;
};

export const getOrganizerDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const employee = await getOrCreateEmployee(req.user.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const assignedEvents = await Event.find({ _id: { $in: employee.assignedEvents || [] } })
      .sort({ date: 1 })
      .populate('createdBy', 'name email');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayEvents = assignedEvents.filter((e) => {
      const eventDate = new Date(e.date);
      return eventDate >= today && eventDate < tomorrow;
    });

    const upcomingEvents = assignedEvents.filter((e) => new Date(e.date) >= now);
    const completedEvents = assignedEvents.filter((e) => e.status === 'completed');

    const enrichedEvents = await Promise.all(
      assignedEvents.map(async (event) => {
        const registrations = await Registration.find({
          event: event._id,
          status: { $in: ['active', 'pending'] },
        });
        const totalAttendees = registrations.reduce((sum, r) => sum + (r.numberOfTickets || 0), 0);
        return {
          ...event.toObject(),
          registeredAttendees: totalAttendees,
          occupancyRate: event.capacity > 0 ? Math.round((totalAttendees / event.capacity) * 100) : 0,
        };
      })
    );

    const totalRegisteredAttendees = enrichedEvents.reduce(
      (sum, e) => sum + e.registeredAttendees,
      0
    );

    const todaySlotsUsed = todayEvents.filter(
      (e) => e.status !== 'cancelled'
    ).length;
    const todaySlotsAvailable = MAX_EVENTS_PER_DAY - todaySlotsUsed;

    const waitingListCount = await WaitingList.countDocuments({
      organizer: req.user.id,
      status: 'waiting',
    });

    const pendingClients = await WaitingList.find({
      organizer: req.user.id,
      status: 'waiting',
    })
      .sort({ createdAt: 1 })
      .limit(5)
      .populate('client', 'name email');

    res.status(200).json({
      success: true,
      dashboard: {
        organizerId: user.organizerId,
        name: user.name,
        email: user.email,
        totalEvents: assignedEvents.length,
        upcomingEvents: enrichedEvents.filter((e) => new Date(e.date) >= now),
        todayEvents,
        todaySlotsUsed,
        todaySlotsAvailable,
        completedEvents: completedEvents.length,
        pendingClients: pendingClients,
        waitingListCount,
        totalRegisteredAttendees,
        events: enrichedEvents,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getOrganizerEvents = async (req, res) => {
  try {
    const employee = await getOrCreateEmployee(req.user.id);
    const { status, category, search } = req.query;
    const filter = { _id: { $in: employee.assignedEvents || [] } };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: safe, $options: 'i' } },
        { venue: { $regex: safe, $options: 'i' } },
        { location: { $regex: safe, $options: 'i' } },
      ];
    }

    const events = await Event.find(filter)
      .sort({ date: 1 })
      .populate('createdBy', 'name email');

    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const registrations = await Registration.find({
          event: event._id,
          status: { $in: ['active', 'pending'] },
        }).populate('client', 'name email');
        const totalAttendees = registrations.reduce(
          (sum, r) => sum + (r.numberOfTickets || 0),
          0
        );
        return {
          ...event.toObject(),
          registrations: registrations.map((r) => ({
            _id: r._id,
            client: r.client,
            numberOfTickets: r.numberOfTickets,
            totalAmount: r.totalAmount,
            status: r.status,
            ticketId: r.ticketId,
            registrationDate: r.registrationDate,
          })),
          registeredAttendees: totalAttendees,
          occupancyRate:
            event.capacity > 0
              ? Math.round((totalAttendees / event.capacity) * 100)
              : 0,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedEvents.length,
      events: enrichedEvents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const targetDate = new Date(date);
    const dayStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const employee = await Employee.findOne({ user: req.params.id || req.user.id });
    if (!employee) {
      return res.status(200).json({
        success: true,
        date: dayStart.toISOString().split('T')[0],
        slotsUsed: 0,
        slotsAvailable: MAX_EVENTS_PER_DAY,
        maxSlots: MAX_EVENTS_PER_DAY,
        isFullyBooked: false,
        eventsOnDate: [],
        waitingListCount: 0,
      });
    }

    const eventsOnDate = await Event.find({
      _id: { $in: employee.assignedEvents || [] },
      date: { $gte: dayStart, $lt: dayEnd },
      status: { $ne: 'cancelled' },
    });

    const slotsUsed = eventsOnDate.length;
    const slotsAvailable = MAX_EVENTS_PER_DAY - slotsUsed;

    const waitingList = await WaitingList.find({
      organizer: req.params.id || req.user.id,
      eventDate: { $gte: dayStart, $lt: dayEnd },
      status: 'waiting',
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      date: dayStart.toISOString().split('T')[0],
      slotsUsed,
      slotsAvailable,
      maxSlots: MAX_EVENTS_PER_DAY,
      isFullyBooked: slotsAvailable <= 0,
      eventsOnDate: eventsOnDate.map((e) => ({
        _id: e._id,
        title: e.title,
        time: e.time,
        venue: e.venue,
        status: e.status,
      })),
      waitingListCount: waitingList.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getAllOrganizersAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const targetDate = new Date(date);
    const dayStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const employees = await Employee.find()
      .populate('user', 'name email organizerId profileImage');

    const availability = await Promise.all(
      employees.map(async (emp) => {
        if (!emp.user) return null;

        const eventsOnDate = await Event.find({
          _id: { $in: emp.assignedEvents || [] },
          date: { $gte: dayStart, $lt: dayEnd },
          status: { $ne: 'cancelled' },
        });

        const slotsUsed = eventsOnDate.length;
        const slotsAvailable = MAX_EVENTS_PER_DAY - slotsUsed;

        return {
          employeeId: emp._id,
          userId: emp.user._id,
          name: emp.user.name,
          email: emp.user.email,
          organizerId: emp.user.organizerId,
          profileImage: emp.user.profileImage,
          specialization: emp.specialization,
          experience: emp.experience,
          slotsUsed,
          slotsAvailable,
          maxSlots: MAX_EVENTS_PER_DAY,
          isFullyBooked: slotsAvailable <= 0,
          eventsOnDate: eventsOnDate.map((e) => ({
            _id: e._id,
            title: e.title,
            time: e.time,
          })),
        };
      })
    );

    res.status(200).json({
      success: true,
      date: dayStart.toISOString().split('T')[0],
      organizers: availability.filter(Boolean),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const addToWaitingList = async (req, res) => {
  try {
    const { organizerId, eventDate, preferredTime, eventDetails } = req.body;

    const organizer = await User.findById(organizerId);
    if (!organizer || organizer.role !== 'employee') {
      return res.status(404).json({ success: false, message: 'Organizer not found' });
    }

    const targetDate = new Date(eventDate);
    const dayStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const existingEntry = await WaitingList.findOne({
      client: req.user.id,
      organizer: organizerId,
      eventDate: { $gte: dayStart, $lt: dayEnd },
      status: { $in: ['waiting', 'notified'] },
    });

    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: 'You are already on the waiting list for this organizer on this date',
      });
    }

    const lastEntry = await WaitingList.findOne({
      organizer: organizerId,
      eventDate: { $gte: dayStart, $lt: dayEnd },
    }).sort({ position: -1 });

    const position = lastEntry ? lastEntry.position + 1 : 1;

    const entry = await WaitingList.create({
      client: req.user.id,
      organizer: organizerId,
      eventDate: dayStart,
      preferredTime,
      eventDetails,
      position,
      status: 'waiting',
    });

    res.status(201).json({
      success: true,
      message: 'Added to waiting list successfully',
      waitingListEntry: entry,
      position,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getWaitingList = async (req, res) => {
  try {
    const { date } = req.query;
    const filter = { organizer: req.user.id, status: 'waiting' };

    if (date) {
      const targetDate = new Date(date);
      const dayStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      filter.eventDate = { $gte: dayStart, $lt: dayEnd };
    }

    const entries = await WaitingList.find(filter)
      .sort({ eventDate: 1, position: 1 })
      .populate('client', 'name email');

    res.status(200).json({
      success: true,
      count: entries.length,
      waitingList: entries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const cancelEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    event.status = 'cancelled';
    await event.save();

    const eventDate = new Date(event.date);
    const dayStart = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const nextInLine = await WaitingList.findOne({
      organizer: req.user.id,
      eventDate: { $gte: dayStart, $lt: dayEnd },
      status: 'waiting',
    }).sort({ position: 1 });

    if (nextInLine) {
      nextInLine.status = 'notified';
      await nextInLine.save();
    }

    res.status(200).json({
      success: true,
      message: 'Event cancelled successfully',
      notifiedClient: nextInLine
        ? { id: nextInLine.client, position: nextInLine.position }
        : null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getOrganizerBookings = async (req, res) => {
  try {
    const employee = await getOrCreateEmployee(req.user.id);
    const eventIds = employee.assignedEvents || [];
    const { status } = req.query;
    const filter = { event: { $in: eventIds } };
    if (status) filter.status = status;

    const registrations = await Registration.find(filter)
      .sort({ createdAt: -1 })
      .populate('client', 'name email')
      .populate('event', 'title date time venue location category');

    res.status(200).json({
      success: true,
      count: registrations.length,
      bookings: registrations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getOrganizerClients = async (req, res) => {
  try {
    const employee = await getOrCreateEmployee(req.user.id);
    const eventIds = employee.assignedEvents || [];
    const registrations = await Registration.find({ event: { $in: eventIds } })
      .populate('client', 'name email profileImage')
      .populate('event', 'title date venue');

    const clientMap = new Map();
    for (const reg of registrations) {
      if (!reg.client) continue;
      const clientId = reg.client._id.toString();
      if (!clientMap.has(clientId)) {
        clientMap.set(clientId, {
          _id: reg.client._id,
          name: reg.client.name,
          email: reg.client.email,
          profileImage: reg.client.profileImage,
          events: [],
          totalBookings: 0,
          totalSpent: 0,
        });
      }
      const entry = clientMap.get(clientId);
      entry.totalBookings++;
      entry.totalSpent += reg.totalAmount || 0;
      if (reg.event) {
        entry.events.push({
          _id: reg.event._id,
          title: reg.event.title,
          date: reg.event.date,
          venue: reg.event.venue,
          status: reg.status,
          numberOfTickets: reg.numberOfTickets,
        });
      }
    }

    let clients = Array.from(clientMap.values());
    if (req.query.search) {
      const safe = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(safe, 'i');
      clients = clients.filter((c) => regex.test(c.name) || regex.test(c.email));
    }

    res.status(200).json({
      success: true,
      count: clients.length,
      clients,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getOrganizerPayments = async (req, res) => {
  try {
    const employee = await getOrCreateEmployee(req.user.id);
    const eventIds = employee.assignedEvents || [];
    const events = await Event.find({ _id: { $in: eventIds } });

    const payments = await Payment.find({ event: { $in: events.map((e) => e._id) } })
      .sort({ createdAt: -1 })
      .populate('client', 'name email')
      .populate('event', 'title date venue')
      .populate('registration', 'ticketId numberOfTickets');

    let filtered = payments;
    if (req.query.status) {
      filtered = payments.filter((p) => p.paymentStatus === req.query.status);
    }
    if (req.query.search) {
      const safe = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(safe, 'i');
      filtered = filtered.filter(
        (p) =>
          regex.test(p.client?.name) ||
          regex.test(p.event?.title) ||
          regex.test(p._id.toString())
      );
    }

    const totalRevenue = filtered
      .filter((p) => p.paymentStatus === 'successful')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    res.status(200).json({
      success: true,
      count: filtered.length,
      totalRevenue,
      payments: filtered,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getOrganizerSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const employee = await Employee.findOne({ user: req.user.id });

    res.status(200).json({
      success: true,
      settings: {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        organizerId: user.organizerId,
        profileImage: user.profileImage || '',
        specialization: employee?.specialization || '',
        experience: employee?.experience || 0,
        bio: employee?.bio || '',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateOrganizerSettings = async (req, res) => {
  try {
    const { name, email, phone, specialization, experience, bio, profileImage } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email && email !== user.email) {
      const existing = await User.findOne({ email, _id: { $ne: user._id } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = email;
    }
    if (phone !== undefined) user.phone = phone;
    if (profileImage !== undefined) user.profileImage = profileImage;
    await user.save();

    const employee = await Employee.findOne({ user: req.user.id });
    if (employee) {
      if (specialization !== undefined) employee.specialization = specialization;
      if (experience !== undefined) employee.experience = experience;
      if (bio !== undefined) employee.bio = bio;
      await employee.save();
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, name: user.name, email: user.email, organizerId: user.organizerId || null },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, organizerId: user.organizerId, profileImage: user.profileImage },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
