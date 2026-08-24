import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getDecorations, createDecoration, deleteDecoration } from '../../services/decorationService';
import toast from 'react-hot-toast';

export default function AdminDecorations() {
  const [decorations, setDecorations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchDecorations();
  }, []);

  const fetchDecorations = async () => {
    try {
      setLoading(true);
      const response = await getDecorations();
      setDecorations(response.data.decorations || response.data);
    } catch (error) {
      toast.error('Failed to load decorations');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      if (formData.image) submitData.append('image', formData.image);

      await createDecoration(submitData);
      toast.success('Decoration added successfully');
      resetForm();
      fetchDecorations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add decoration');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDecoration(deleteConfirm._id);
      toast.success('Decoration deleted successfully');
      setDeleteConfirm(null);
      fetchDecorations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete decoration');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', category: '', description: '', image: null });
    setImagePreview(null);
    setShowModal(false);
  };

  const categories = ['stage', 'lighting', 'floral', 'table', 'entrance', 'backdrop', 'other'];

  const filteredDecorations = decorations.filter((dec) => {
    const matchesSearch = dec.title?.toLowerCase().includes(search.toLowerCase()) ||
      dec.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || dec.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Decoration Management</h1>
          <p className="text-gray-500 mt-1">Manage event decorations and gallery</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          Add Decoration
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search decorations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredDecorations.length === 0 ? (
        <EmptyState message="No decorations found" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDecorations.map((decoration) => (
            <div key={decoration._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative aspect-square">
                <img
                  src={decoration.image}
                  alt={decoration.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => setDeleteConfirm(decoration)}
                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{decoration.title}</h3>
                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full capitalize">
                  {decoration.category}
                </span>
                {decoration.description && (
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{decoration.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal onClose={resetForm} title="Add Decoration">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                <div className="space-y-2 text-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-lg" />
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} required className="sr-only" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add Decoration</button>
            </div>
          </form>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal onClose={() => setDeleteConfirm(null)} title="Delete Decoration">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <img src={deleteConfirm.image} alt={deleteConfirm.title} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <p className="font-medium text-gray-900">{deleteConfirm.title}</p>
                <p className="text-sm text-gray-500 capitalize">{deleteConfirm.category}</p>
              </div>
            </div>
            <p className="text-gray-600">Are you sure you want to delete this decoration? This action cannot be undone.</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
