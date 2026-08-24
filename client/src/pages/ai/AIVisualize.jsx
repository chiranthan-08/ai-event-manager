import { useState } from 'react';
import { Image, Sparkles, Loader2, Download, RefreshCw } from 'lucide-react';
import { visualizeEvent } from '../../services/aiService';
import toast from 'react-hot-toast';

const AIVisualize = () => {
  const [formData, setFormData] = useState({
    eventType: 'wedding',
    theme: '',
    venue: '',
    guestCount: '',
    colorScheme: '',
    specialRequests: '',
  });
  const [visualization, setVisualization] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await visualizeEvent(formData);
      setVisualization(response.data);
    } catch (error) {
      toast.error('Failed to generate visualization');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleSubmit({ preventDefault: () => {} });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI Event Visualization</h1>
          <p className="text-gray-600 mt-2">
            Generate visual concepts for your events using AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Event Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Event Type</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="conference">Conference</option>
                  <option value="festival">Festival</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="label">Theme</label>
                <input
                  type="text"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Rustic, Modern, Tropical"
                />
              </div>

              <div>
                <label className="label">Venue Type</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Banquet Hall, Garden, Beach"
                />
              </div>

              <div>
                <label className="label">Expected Guests</label>
                <input
                  type="number"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Number of guests"
                />
              </div>

              <div>
                <label className="label">Color Scheme</label>
                <input
                  type="text"
                  name="colorScheme"
                  value={formData.colorScheme}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Gold & White, Pastel Pink"
                />
              </div>

              <div>
                <label className="label">Special Requests</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className="input-field"
                  rows={3}
                  placeholder="Any specific requirements or ideas..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Visualization
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Generated Concept</h2>
            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">AI is creating your visualization...</p>
                </div>
              </div>
            ) : visualization ? (
              <div className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
                  {visualization.imageUrl ? (
                    <img
                      src={visualization.imageUrl}
                      alt="Event visualization"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="text-center p-8">
                      <Sparkles className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                      <p className="text-gray-600">AI-generated concept ready</p>
                    </div>
                  )}
                </div>

                {visualization.description && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 text-sm">{visualization.description}</p>
                  </div>
                )}

                {visualization.suggestions?.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Suggestions</h3>
                    <ul className="space-y-2">
                      {visualization.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-primary-500 mt-0.5">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleRegenerate}
                    className="btn-outline flex-1 flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={16} />
                    Regenerate
                  </button>
                  <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <Download size={16} />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Fill in the details and click "Generate" to create a visual concept
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIVisualize;
