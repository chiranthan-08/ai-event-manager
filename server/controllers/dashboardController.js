import Event from '../models/Event.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Registration from '../models/Registration.js';
import Payment from '../models/Payment.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalEmployees = await Employee.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    const revenueResult = await Payment.aggregate([
      { $match: { paymentStatus: 'successful' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const upcomingEvents = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(5)
      .populate('createdBy', 'name email');

    const recentPayments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('client', 'name email');

    const cancellationRequests = await Registration.find({ status: 'cancelled' })
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate('client', 'name email')
      .populate('event', 'title date');

    const registrationsByStatus = await Registration.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const eventsByCategory = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
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
        registrationsByStatus: registrationsByStatus.reduce((acc, r) => { acc[r._id] = r.count; return acc; }, {}),
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

    const assignedEvents = await Event.find({ _id: { $in: employee.assignedEvents } })
      .sort({ date: 1 })
      .populate('createdBy', 'name email');

    const enrichedEvents = await Promise.all(
      assignedEvents.map(async (event) => {
        const registrations = await Registration.find({ event: event._id, status: { $in: ['active', 'pending'] } });
        const totalAttendees = registrations.reduce((sum, r) => sum + (r.numberOfTickets || 0), 0);
        return {
          ...event.toObject(),
          registeredAttendees: totalAttendees,
          occupancyRate: event.capacity > 0 ? Math.round((totalAttendees / event.capacity) * 100) : 0,
        };
      })
    );

    const now = new Date();
    const upcomingEvents = enrichedEvents.filter((e) => new Date(e.date) >= now);
    const pastEvents = enrichedEvents.filter((e) => new Date(e.date) < now);

    res.status(200).json({
      success: true,
      dashboard: {
        totalAssigned: assignedEvents.length,
        upcomingEvents,
        pastEvents,
        totalRegisteredAttendees: enrichedEvents.reduce((sum, e) => sum + e.registeredAttendees, 0),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getClientDashboard = async (req, res) => {
  try {
    const registrations = await Registration.find({ client: req.user.id })
      .sort({ createdAt: -1 })
      .populate('event');

    const now = new Date();
    const upcomingRegistrations = registrations.filter(
      (r) => r.event && new Date(r.event.date) >= now && r.status === 'active'
    );
    const pastRegistrations = registrations.filter(
      (r) => r.event && new Date(r.event.date) < now
    );

    const payments = await Payment.find({ client: req.user.id })
      .sort({ createdAt: -1 })
      .populate('registration')
      .populate('event');

    const completedPayments = await Payment.find({ client: req.user.id, paymentStatus: 'successful' });
    const totalSpent = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const tickets = registrations
      .filter((r) => r.status === 'active' || r.status === 'pending')
      .map((r) => ({
        ticketId: r.ticketId,
        event: r.event?.title,
        date: r.event?.date,
        venue: r.event?.venue,
        seats: r.numberOfTickets,
        status: r.status,
      }));

    res.status(200).json({
      success: true,
      dashboard: {
        totalRegistrations: registrations.length,
        upcomingRegistrations,
        pastRegistrations,
        paymentHistory: payments,
        totalSpent,
        tickets,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
