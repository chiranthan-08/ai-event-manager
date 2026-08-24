import Event from '../models/Event.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Registration from '../models/Registration.js';
import Payment from '../models/Payment.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const totalRegistrations = await Registration.countDocuments();

    const revenueResult = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const upcomingEvents = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(5)
      .populate('createdBy', 'name email');

    const recentPayments = await Payment.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    const cancellationRequests = await Registration.find({ status: 'cancelled' })
      .populate('user', 'name email')
      .populate('event', 'title date')
      .sort({ cancelledAt: -1 })
      .limit(10);

    const registrationsByStatus = await Registration.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const eventsByCategory = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        totalEvents,
        totalClients,
        totalEmployees,
        totalRegistrations,
        totalRevenue,
        upcomingEvents,
        recentPayments,
        cancellationRequests,
        registrationsByStatus: registrationsByStatus.reduce((acc, item) => {
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

export const getEmployeeDashboard = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    const assignedEvents = await Event.find({
      assignedEmployees: employee._id,
    })
      .sort({ date: 1 })
      .populate('createdBy', 'name email');

    const eventIds = assignedEvents.map((e) => e._id);

    const registrationCounts = await Registration.aggregate([
      { $match: { event: { $in: eventIds }, status: { $in: ['confirmed', 'pending'] } } },
      { $group: { _id: '$event', count: { $sum: '$numberOfSeats' } } },
    ]);

    const eventsWithStats = assignedEvents.map((event) => {
      const regCount = registrationCounts.find(
        (r) => r._id.toString() === event._id.toString()
      );
      return {
        ...event.toObject(),
        registeredAttendees: regCount ? regCount.count : 0,
        occupancyRate: event.capacity > 0
          ? Math.round(((regCount ? regCount.count : 0) / event.capacity) * 100)
          : 0,
      };
    });

    const upcomingEvents = eventsWithStats.filter(
      (e) => new Date(e.date) >= new Date()
    );
    const pastEvents = eventsWithStats.filter(
      (e) => new Date(e.date) < new Date()
    );

    res.status(200).json({
      success: true,
      dashboard: {
        totalAssigned: assignedEvents.length,
        upcomingEvents,
        pastEvents,
        totalRegisteredAttendees: registrationCounts.reduce(
          (sum, r) => sum + r.count,
          0
        ),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getClientDashboard = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate('event', 'title date venue category images status ticketPrice')
      .sort({ createdAt: -1 });

    const upcomingRegistrations = registrations.filter(
      (r) => r.event && new Date(r.event.date) >= new Date() && r.status === 'confirmed'
    );

    const pastRegistrations = registrations.filter(
      (r) => r.event && new Date(r.event.date) < new Date()
    );

    const paymentHistory = await Payment.find({ user: req.user.id })
      .populate({
        path: 'registration',
        populate: { path: 'event', select: 'title date' },
      })
      .sort({ createdAt: -1 });

    const totalSpent = await Payment.aggregate([
      { $match: { user: req.user.id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const tickets = registrations
      .filter((r) => r.status === 'confirmed' || r.status === 'pending')
      .map((r) => ({
        ticketId: r.ticketId,
        event: r.event?.title,
        date: r.event?.date,
        venue: r.event?.venue,
        seats: r.numberOfSeats,
        status: r.status,
      }));

    res.status(200).json({
      success: true,
      dashboard: {
        totalRegistrations: registrations.length,
        upcomingRegistrations,
        pastRegistrations,
        paymentHistory,
        totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
        tickets,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
