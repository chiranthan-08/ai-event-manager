import db from '../utils/memoryDb.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const stats = db.getStats();

    const now = new Date();
    const upcomingEvents = db.findEvents({})
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5)
      .map((e) => {
        const creator = e.createdBy ? db.findUserById(e.createdBy) : null;
        return { ...e, createdBy: creator };
      });

    const recentPayments = db.findPayment({})
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map((p) => {
        const user = p.user ? db.findUserById(p.user) : null;
        return { ...p, user };
      });

    const cancellationRequests = db.findRegistrations({ status: 'cancelled' })
      .sort((a, b) => new Date(b.cancelledAt || 0) - new Date(a.cancelledAt || 0))
      .slice(0, 10)
      .map((r) => {
        const user = r.user ? db.findUserById(r.user) : null;
        const event = r.event ? db.findEventById(r.event) : null;
        return { ...r, user, event };
      });

    const allRegistrations = db.findRegistrations({});
    const registrationsByStatus = {};
    allRegistrations.forEach((r) => {
      registrationsByStatus[r.status] = (registrationsByStatus[r.status] || 0) + 1;
    });

    const allEvents = db.findEvents({});
    const eventsByCategory = {};
    allEvents.forEach((e) => {
      const cat = e.category || 'uncategorized';
      eventsByCategory[cat] = (eventsByCategory[cat] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      dashboard: {
        totalEvents: stats.totalEvents,
        totalClients: stats.totalClients,
        totalEmployees: stats.totalEmployees,
        totalRegistrations: stats.totalRegistrations,
        totalRevenue: stats.totalRevenue,
        upcomingEvents,
        recentPayments,
        cancellationRequests,
        registrationsByStatus,
        eventsByCategory: Object.entries(eventsByCategory).map(([cat, count]) => ({ _id: cat, count })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getEmployeeDashboard = async (req, res) => {
  try {
    const employee = db.findEmployeeByUser(req.user.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    const assignedEvents = (employee.assignedEvents || [])
      .map((eid) => db.findEventById(eid))
      .filter(Boolean)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((event) => {
        const creator = event.createdBy ? db.findUserById(event.createdBy) : null;
        const registrations = db.findRegistrations({ event: event._id || event.id });
        const activeRegistrations = registrations.filter(
          (r) => r.status === 'confirmed' || r.status === 'pending'
        );
        const totalAttendees = activeRegistrations.reduce((sum, r) => sum + (r.numberOfSeats || 0), 0);
        return {
          ...event,
          createdBy: creator,
          registeredAttendees: totalAttendees,
          occupancyRate: event.capacity > 0 ? Math.round((totalAttendees / event.capacity) * 100) : 0,
        };
      });

    const now = new Date();
    const upcomingEvents = assignedEvents.filter((e) => new Date(e.date) >= now);
    const pastEvents = assignedEvents.filter((e) => new Date(e.date) < now);

    res.status(200).json({
      success: true,
      dashboard: {
        totalAssigned: assignedEvents.length,
        upcomingEvents,
        pastEvents,
        totalRegisteredAttendees: assignedEvents.reduce((sum, e) => sum + e.registeredAttendees, 0),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getClientDashboard = async (req, res) => {
  try {
    const registrations = db.findRegistrations({ user: req.user.id })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((reg) => {
        const event = reg.event ? db.findEventById(reg.event) : null;
        return { ...reg, event };
      });

    const now = new Date();
    const upcomingRegistrations = registrations.filter(
      (r) => r.event && new Date(r.event.date) >= now && r.status === 'confirmed'
    );
    const pastRegistrations = registrations.filter(
      (r) => r.event && new Date(r.event.date) < now
    );

    const payments = db.findPayment({ user: req.user.id })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((p) => {
        const reg = p.registration ? db.findRegistrationById(p.registration) : null;
        const event = reg && reg.event ? db.findEventById(reg.event) : null;
        return { ...p, registration: reg ? { ...reg, event } : null };
      });

    const totalSpent = db.findPayment({ user: req.user.id, status: 'completed' })
      .reduce((sum, p) => sum + (p.amount || 0), 0);

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
        paymentHistory: payments,
        totalSpent,
        tickets,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
