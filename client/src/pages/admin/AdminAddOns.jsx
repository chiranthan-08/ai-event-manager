import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import addOnService from '../../services/addOnService';
import toast from 'react-hot-toast';

const categoryIcons = {
  'Flowers': '🌸', 'Food & Snacks': '🍽️', 'Decor': '🎨', 'Return Gifts': '🎁',
  'Lighting': '💡', 'Furniture': '🪑', 'Tableware': '🍴', 'Props': '🎭',
};

const categories = ['Flowers', 'Food & Snacks', 'Decor', 'Return Gifts', 'Lighting', 'Furniture', 'Tableware', 'Props'];
const units = ['per piece', 'per kg', 'per set', 'per hour', 'per day', 'per person', 'flat rate'];

export default function AdminAddOns() {
  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAddOn, setEditingAddOn] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: '', description: '', price: '', unit: 'per piece', image: '', inStock: true,
  });

  useEffect(() => {
    fetchAddOns();
  }, []);

  const fetchAddOns = async () => {
    try {
      setLoading(true);
      const data = await addOnService.getAddOns({ limit: 100 });
      setAddOns(data.addOns || []);
    } catch {
      toast.error('Failed to load add-ons');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, price: Number(formData.price) };
      if (editingAddOn) {
        await addOnService.updateAddOn(editingAddOn._id, payload);
        toast.success('Add-on updated');
      } else {
        await addOnService.createAddOn(payload);
        toast.success('Add-on created');
      }
      resetForm();
      fetchAddOns();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save add-on');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', category: '', description: '', price: '', unit: 'per piece', image: '', inStock: true });
    setShowModal(false);
    setEditingAddOn(null);
  };

  const openEdit = (addOn) => {
    setEditingAddOn(addOn);
    setFormData({
      name: addOn.name, category: addOn.category, description: addOn.description,
      price: addOn.price, unit: addOn.unit, image: addOn.image, inStock: addOn.inStock,
    });
    setShowModal(true);
  };

  const filteredAddOns = addOns.filter(a => {
    const matchCat = !categoryFilter || a.category === categoryFilter;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add-On Management</h1>
          <p className="text-gray-500 mt-1">Manage event add-on products and services</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} /> Add Add-On
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(categoryFilter === cat ? '' : cat)}
            className={`p-3 rounded-xl border-2 text-center transition-all ${
              categoryFilter === cat
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <span className="text-2xl">{categoryIcons[cat]}</span>
            <p className="text-xs font-semibold text-gray-700 mt-1">{cat}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search add-ons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredAddOns.length === 0 ? (
        <EmptyState message="No add-ons found" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Add-On</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3 text-right">Price</th>
                  <th className="px-6 py-3">Unit</th>
                  <th className="px-6 py-3 text-center">Stock</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAddOns.map((addOn) => (
                  <tr key={addOn._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={addOn.image} alt={addOn.name} className="w-10 h-10 rounded-lg object-cover" onError={(e) => { e.target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#f97316" rx="8"/><text x="20" y="26" font-size="16" text-anchor="middle" fill="white" font-family="sans-serif">${addOn.category.charAt(0)}</text></svg>`)}`; }} />
                        <div>
                          <p className="font-medium text-gray-900">{addOn.name}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{addOn.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                        {categoryIcons[addOn.category]} {addOn.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">₹{addOn.price?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{addOn.unit}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${addOn.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {addOn.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(addOn)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setDeleteConfirm(addOn)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <Modal onClose={resetForm} title={editingAddOn ? 'Edit Add-On' : 'Add New Add-On'}>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                <select name="unit" value={formData.unit} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="url" name="image" value={formData.image} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="https://..." />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
              <label className="text-sm font-medium text-gray-700">In Stock</label>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">{editingAddOn ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal onClose={() => setDeleteConfirm(null)} title="Delete Add-On">
          <div className="p-6">
            <p className="text-gray-600">Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={async () => {
                try {
                  await addOnService.deleteAddOn(deleteConfirm._id);
                  toast.success('Add-on deleted');
                  setDeleteConfirm(null);
                  fetchAddOns();
                } catch (err) {
                  toast.error(err.response?.data?.message || 'Failed to delete');
                }
              }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
