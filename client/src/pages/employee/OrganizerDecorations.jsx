import { useState, useEffect, useMemo } from 'react';
import { Search, Star, IndianRupee, Plus, X, Trash2, Edit } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getDecorations, createDecoration, updateDecoration, deleteDecoration } from '../../services/decorationService';
import { getOrganizerEvents } from '../../services/organizerService';
import toast from 'react-hot-toast';

const eventCategories = ['All', 'Wedding', 'Birthday', 'Corporate', 'College', 'Festival', 'Anniversary', 'Party', 'Other'];
const decorationTypes = ['All', 'Stage', 'Lighting', 'Floral', 'Table', 'Entrance', 'Backdrop', 'Other'];

export default function OrganizerDecorations() {
  const [decorations, setDecorations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Wedding',
    decorationType: 'Other',
    event: '',
    priceRange: '',
    image: '',
  });

  useEffect(() => {
    fetchDecorations();
    fetchEvents();
  }, []);

  const fetchDecorations = async () => {
    try {
      setLoading(true);
      const response = await getDecorations({ limit: 100 });
      setDecorations(response.data.decorations || []);
    } catch {
      toast.error('Failed to load decorations');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await getOrganizerEvents();
      setEvents(response.data.events || []);
    } catch {
      // silently fail
    }
  };

  const filteredDecorations = useMemo(() => {
    return decorations.filter((dec) => {
      const q = localSearch.toLowerCase();
      const matchesSearch =
        !localSearch ||
        dec.title?.toLowerCase().includes(q) ||
        dec.description?.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === 'All' || dec.category === categoryFilter;
      const matchesType = typeFilter === 'All' || dec.decorationType === typeFilter;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [decorations, localSearch, categoryFilter, typeFilter]);

  const resetForm = () => {
    setForm({ title: '', description: '', category: 'Wedding', decorationType: 'Other', event: '', priceRange: '', image: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (dec) => {
    setForm({
      title: dec.title || '',
      description: dec.description || '',
      category: dec.category || 'Wedding',
      decorationType: dec.decorationType || 'Other',
      event: dec.event?._id || dec.event || '',
      priceRange: dec.priceRange || '',
      image: dec.image || '',
    });
    setEditingId(dec._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this decoration?')) return;
    try {
      await deleteDecoration(id);
      setDecorations(decorations.filter((d) => d._id !== id));
      toast.success('Decoration deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete decoration');
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error('Decoration name is required');
      return;
    }
    if (!form.event) {
      toast.error('Please select an event');
      return;
    }
    try {
      if (editingId) {
        const response = await updateDecoration(editingId, form);
        setDecorations(decorations.map((d) => d._id === editingId ? response.data.decoration : d));
        toast.success('Decoration updated');
      } else {
        const response = await createDecoration(form);
        setDecorations([response.data.decoration, ...decorations]);
        toast.success('Decoration created');
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save decoration');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Decorations</h1>
          <p className="text-gray-500 mt-1">Browse and manage decoration themes for your events</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} /> Add Decoration
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Decoration' : 'Add New Decoration'}</h3>
            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Decoration Name *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="e.g. Royal Floral Mandap" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event *</label>
              <select value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                <option value="">Select an event</option>
                {events.map((evt) => (
                  <option key={evt._id} value={evt._id}>{evt.title} ({evt.category})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                {eventCategories.filter(c => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Decoration Type</label>
              <select value={form.decorationType} onChange={(e) => setForm({ ...form, decorationType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                {decorationTypes.filter(t => t !== 'All').map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <input type="text" value={form.priceRange} onChange={(e) => setForm({ ...form, priceRange: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="e.g. ₹25,000 - ₹50,000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none" placeholder="Describe the decoration..." />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">{editingId ? 'Update' : 'Create'} Decoration</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search decorations..." value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Event Category</p>
          <div className="flex flex-wrap gap-2">
            {eventCategories.map((cat) => (
              <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${categoryFilter === cat ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {cat === 'All' ? 'All Events' : cat}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Decoration Type</p>
          <div className="flex flex-wrap gap-2">
            {decorationTypes.map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${typeFilter === t ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {t === 'All' ? 'All Types' : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredDecorations.length === 0 ? (
        <EmptyState message="No decorations found" description="Add your first decoration to get started." actionLabel="Add Decoration" onAction={() => { resetForm(); setShowForm(true); }} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDecorations.map((dec) => (
            <div key={dec._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <img src={dec.image} alt={dec.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#e2e8f0"/><text x="200" y="150" font-size="16" text-anchor="middle" fill="#94a3b8" font-family="sans-serif">No Image</text></svg>')}`; }} />
                <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full bg-white/90 text-gray-700">{dec.category}</span>
                <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">{dec.decorationType || 'Other'}</span>
                <div className="absolute bottom-3 right-3 flex gap-1">
                  <button onClick={() => handleEdit(dec)} className="p-1.5 bg-white/90 rounded-full hover:bg-white text-gray-600 hover:text-emerald-600 transition-colors"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(dec._id)} className="p-1.5 bg-white/90 rounded-full hover:bg-white text-gray-600 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{dec.title}</h3>
                {dec.description && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{dec.description}</p>}
                <div className="flex items-center justify-between text-sm">
                  {dec.priceRange && <span className="flex items-center gap-1 text-emerald-600 font-medium"><IndianRupee size={14} /> {dec.priceRange}</span>}
                  {dec.rating > 0 && <span className="flex items-center gap-1 text-amber-600"><Star size={14} fill="currentColor" /> {dec.rating}</span>}
                </div>
                {dec.includes?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {dec.includes.slice(0, 3).map((item, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{item}</span>
                    ))}
                    {dec.includes.length > 3 && <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">+{dec.includes.length - 3} more</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
