import db from '../utils/memoryDb.js';

export const getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allEmployees = db.findEmployees();
    const total = allEmployees.length;
    const skip = (Number(page) - 1) * Number(limit);
    const paginated = allEmployees.slice(skip, skip + Number(limit));

    const enriched = paginated.map((emp) => {
      const user = emp.user ? db.findUserById(emp.user) : null;
      const assignedEvents = (emp.assignedEvents || []).map((eid) => db.findEventById(eid)).filter(Boolean);
      return { ...emp, user, assignedEvents };
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      employees: enriched,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employee = db.findEmployeeById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const user = employee.user ? db.findUserById(employee.user) : null;
    const assignedEvents = (employee.assignedEvents || []).map((eid) => db.findEventById(eid)).filter(Boolean);

    res.status(200).json({ success: true, employee: { ...employee, user, assignedEvents } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { userId, department, position, salary, joiningDate, skills, responsibilities } = req.body;

    const user = db.findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const existingEmployee = db.findEmployeeByUser(userId);
    if (existingEmployee) {
      return res.status(400).json({ success: false, message: 'Employee profile already exists for this user' });
    }

    const employees = db.findEmployees();
    const empIdx = employees.findIndex((e) => e.user === userId);
    if (empIdx !== -1) {
      employees[empIdx].role = 'employee';
    }

    const employee = db.createEmployee({
      user: userId,
      department,
      position,
      salary,
      joiningDate,
      skills,
      responsibilities,
      assignedEvents: [],
    });

    const userObj = db.findUserById(userId);
    res.status(201).json({ success: true, employee: { ...employee, user: userObj } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = db.findEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const updatedEmployee = db.updateRegistration
      ? { ...employee, ...req.body }
      : { ...employee, ...req.body };

    const employees = db.findEmployees();
    const idx = employees.findIndex((e) => (e._id || e.id) === req.params.id);
    if (idx !== -1) {
      Object.assign(employees[idx], req.body);
    }

    const user = updatedEmployee.user ? db.findUserById(updatedEmployee.user) : null;
    const assignedEvents = (updatedEmployee.assignedEvents || []).map((eid) => db.findEventById(eid)).filter(Boolean);

    res.status(200).json({ success: true, employee: { ...updatedEmployee, user, assignedEvents } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = db.findEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    if (employee.user) {
      const users = db.findUsers({});
      const idx = users.findIndex((u) => (u._id || u.id) === employee.user);
      if (idx !== -1) {
        users[idx].role = 'client';
      }
    }

    const events = db.findEvents({});
    events.forEach((event) => {
      if (event.assignedEmployees && event.assignedEmployees.includes(req.params.id)) {
        db.updateEvent(event._id || event.id, {
          assignedEmployees: event.assignedEmployees.filter((eid) => eid !== req.params.id),
        });
      }
    });

    const employees = db.findEmployees();
    const empIdx = employees.findIndex((e) => (e._id || e.id) === req.params.id);
    if (empIdx !== -1) {
      employees.splice(empIdx, 1);
    }

    res.status(200).json({ success: true, message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const assignEvent = async (req, res) => {
  try {
    const { employeeId, eventId } = req.body;

    const employee = db.findEmployeeById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const event = db.findEventById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.assignedEmployees && event.assignedEmployees.includes(employeeId)) {
      return res.status(400).json({ success: false, message: 'Employee already assigned to this event' });
    }

    const eventAssignedEmployees = [...(event.assignedEmployees || []), employeeId];
    db.updateEvent(eventId, { assignedEmployees: eventAssignedEmployees });

    const employeeAssignedEvents = [...(employee.assignedEvents || []), eventId];
    const employees = db.findEmployees();
    const empIdx = employees.findIndex((e) => (e._id || e.id) === employeeId);
    if (empIdx !== -1) {
      employees[empIdx].assignedEvents = employeeAssignedEvents;
    }

    const updatedEvent = db.findEventById(eventId);
    const createdBy = updatedEvent.createdBy ? db.findUserById(updatedEvent.createdBy) : null;
    const assignedEmployees = (updatedEvent.assignedEmployees || []).map((eid) => {
      const emp = db.findEmployeeById(eid);
      return emp && emp.user ? db.findUserById(emp.user) : null;
    }).filter(Boolean);

    res.status(200).json({
      success: true,
      event: { ...updatedEvent, createdBy, assignedEmployees },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
