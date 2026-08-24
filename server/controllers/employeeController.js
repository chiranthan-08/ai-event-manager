import Employee from '../models/Employee.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

export const getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Employee.countDocuments();

    const employees = await Employee.find()
      .populate('user', 'name email phone')
      .populate('assignedEvents', 'title date venue status')
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: employees.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      employees,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('assignedEvents', 'title date venue status capacity availableSeats');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, employee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { userId, department, position, salary, joiningDate, skills, responsibilities } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const existingEmployee = await Employee.findOne({ user: userId });
    if (existingEmployee) {
      return res.status(400).json({ success: false, message: 'Employee profile already exists for this user' });
    }

    await User.findByIdAndUpdate(userId, { role: 'employee' });

    const employee = await Employee.create({
      user: userId,
      department,
      position,
      salary,
      joiningDate,
      skills,
      responsibilities,
    });

    const populated = await Employee.findById(employee._id)
      .populate('user', 'name email phone');

    res.status(201).json({ success: true, employee: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('user', 'name email phone')
      .populate('assignedEvents', 'title date venue status');

    res.status(200).json({ success: true, employee: updatedEmployee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    if (employee.user) {
      await User.findByIdAndUpdate(employee.user, { role: 'client' });
    }

    await Event.updateMany(
      { assignedEmployees: req.params.id },
      { $pull: { assignedEmployees: req.params.id } }
    );

    await Employee.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const assignEvent = async (req, res) => {
  try {
    const { employeeId, eventId } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.assignedEmployees.includes(employeeId)) {
      return res.status(400).json({ success: false, message: 'Employee already assigned to this event' });
    }

    event.assignedEmployees.push(employeeId);
    await event.save();

    employee.assignedEvents.push(eventId);
    await employee.save();

    const updatedEvent = await Event.findById(eventId)
      .populate('createdBy', 'name email')
      .populate('assignedEmployees', 'name email');

    res.status(200).json({ success: true, event: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
