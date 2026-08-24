import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, UserCheck, Calendar, Briefcase } from 'lucide-react';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, assignEvent } from '../../services/employeeService';
import toast from 'react-hot-toast';

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    specialization: '',
    experience: '',
    bio: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployees();
      setEmployees(response.data.employees || response.data);
    } catch (error) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        const { password, ...updateData } = formData;
        if (!password) delete updateData.password;
        await updateEmployee(editingEmployee._id, updateData);
        toast.success('Employee updated successfully');
      } else {
        await createEmployee(formData);
        toast.success('Employee created successfully');
      }
      resetForm();
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEmployee(deleteConfirm._id);
      toast.success('Employee deleted successfully');
      setDeleteConfirm(null);
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete employee');
    }
  };

  const handleAssignEvent = async (eventId) => {
    try {
      await assignEvent(assignModal._id, { eventId });
      toast.success('Event assigned successfully');
      setAssignModal(null);
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign event');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', role: 'employee', specialization: '', experience: '', bio: '' });
    setShowModal(false);
    setEditingEmployee(null);
  };

  const openEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      password: '',
      role: employee.role || 'employee',
      specialization: employee.specialization || '',
      experience: employee.experience || '',
      bio: employee.bio || '',
    });
    setShowModal(true);
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(search.toLowerCase()) ||
    emp.email?.toLowerCase().includes(search.toLowerCase()) ||
    emp.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-500 mt-1">Manage your team members</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search employees by name, email, or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredEmployees.length === 0 ? (
        <EmptyState message="No employees found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <div key={employee._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={employee.image || `https://ui-avatars.com/api/?name=${employee.name}&background=random`}
                    alt={employee.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-500">{employee.email}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(employee)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => setDeleteConfirm(employee)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase size={14} />
                  <span className="capitalize">{employee.role}</span>
                </div>
                {employee.specialization && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <UserCheck size={14} />
                    <span>{employee.specialization}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>{employee.assignedEvents?.length || 0} assigned events</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setAssignModal(employee)}
                  className="w-full px-3 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Assign Event
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal onClose={resetForm} title={editingEmployee ? 'Edit Employee' : 'Add Employee'}>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password {editingEmployee ? '(leave blank to keep)' : '*'}</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required={!editingEmployee} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select name="role" value={formData.role} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">{editingEmployee ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal onClose={() => setDeleteConfirm(null)} title="Delete Employee">
          <div className="p-6">
            <p className="text-gray-600">Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </Modal>
      )}

      {assignModal && (
        <Modal onClose={() => setAssignModal(null)} title={`Assign Event to ${assignModal.name}`}>
          <div className="p-6">
            <p className="text-gray-600 mb-4">Select an event to assign to this employee.</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {assignModal.unassignedEvents?.length > 0 ? (
                assignModal.unassignedEvents.map((event) => (
                  <div key={event._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => handleAssignEvent(event._id)} className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      Assign
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">No unassigned events available</p>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setAssignModal(null)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
