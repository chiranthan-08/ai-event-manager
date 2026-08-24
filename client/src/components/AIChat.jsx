import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Loader2, ChevronDown } from 'lucide-react';

const initialForm = {
  eventType: '',
  guests: '',
  budget: '',
  theme: '',
  location: '',
  requirements: '',
};

export default function AIChat({ onGenerate }) {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.eventType.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: `I need a ${form.eventType} event for ${form.guests || 'N/A'} guests with a budget of $${form.budget || 'N/A'}. ${form.theme ? `Theme: ${form.theme}.` : ''} ${form.location ? `Location: ${form.location}.` : ''} ${form.requirements ? `Additional: ${form.requirements}` : ''}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setForm(initialForm);
    setLoading(true);

    try {
      const response = onGenerate ? await onGenerate(form) : null;
      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        content: response || generateMockResponse(form),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'ai',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateMockResponse = (data) => {
    return `## ${data.eventType || 'Event'} Plan

**Overview:**
A beautifully curated ${data.eventType || 'event'} for approximately **${data.guests || '50'} guests** with a budget of **$${data.budget || '5000'}**.

### Venue & Setup
- Recommended venue: Premium banquet hall
- Seating: Theater/round-table style based on event type
- ${data.theme ? `Theme decoration: ${data.theme}` : 'Modern elegant theme'}

### Key Highlights
- Professional stage setup
- Ambient lighting and sound system
- Custom backdrop with event branding
- Floral arrangements and centerpieces

### Schedule
1. Guest arrival & welcome (30 min)
2. Opening ceremony (15 min)
3. Main event activities (2-3 hours)
4. Dinner/refreshments (1 hour)
5. Closing & farewell (15 min)

### Budget Breakdown
| Item | Estimated Cost |
|------|---------------|
| Venue | $${Math.round(Number(data.budget || 5000) * 0.35)} |
| Catering | $${Math.round(Number(data.budget || 5000) * 0.25)} |
| Decorations | $${Math.round(Number(data.budget || 5000) * 0.2)} |
| Entertainment | $${Math.round(Number(data.budget || 5000) * 0.12)} |
| Miscellaneous | $${Math.round(Number(data.budget || 5000) * 0.08)} |

Would you like me to elaborate on any specific aspect?`;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const renderMarkdown = (text) => {
    return text
      .replace(/## (.+)/g, '<h2 class="text-lg font-bold text-gray-900 mb-2">$1</h2>')
      .replace(/### (.+)/g, '<h3 class="text-base font-semibold text-gray-800 mb-1 mt-3">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/\n- /g, '\n<li class="ml-4 list-disc text-gray-700">')
      .replace(/\n\d+\. /g, '\n<li class="ml-4 list-decimal text-gray-700">')
      .replace(/\n/g, '<br />')
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(Boolean).map((c) => c.trim());
        return `<div class="flex gap-4 text-sm py-1 border-b border-gray-100"><span class="text-gray-600">${cells[0]}</span><span class="font-medium ml-auto">${cells[1]}</span></div>`;
      });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-indigo-50">
        <Sparkles className="w-5 h-5 text-violet-600" />
        <h3 className="font-semibold text-gray-900">AI Event Assistant</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-violet-500" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Plan Your Perfect Event</h4>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Tell me about your event and I'll help you create an amazing plan with venue suggestions, budget breakdowns, and more.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : ''}`}>
            {msg.type === 'ai' && (
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.type === 'user'
                  ? 'bg-violet-600 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-800 rounded-bl-md'
              }`}
            >
              {msg.type === 'ai' ? (
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
            {msg.type === 'user' && (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="border-t border-gray-100 p-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 font-medium mb-3"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${showForm ? 'rotate-180' : ''}`} />
          {showForm ? 'Hide form' : 'Quick form'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-3 mb-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Event type (e.g., Wedding)"
                value={form.eventType}
                onChange={(e) => handleChange('eventType', e.target.value)}
                className="col-span-2 sm:col-span-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
              <input
                type="number"
                placeholder="Number of guests"
                value={form.guests}
                onChange={(e) => handleChange('guests', e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
              <input
                type="number"
                placeholder="Budget ($)"
                value={form.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
              <input
                type="text"
                placeholder="Theme (optional)"
                value={form.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
              <input
                type="text"
                placeholder="Location (optional)"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="col-span-2 sm:col-span-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>
            <textarea
              placeholder="Additional requirements (optional)"
              value={form.requirements}
              onChange={(e) => handleChange('requirements', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none"
            />
            <button
              type="submit"
              disabled={!form.eventType.trim() || loading}
              className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Generate Plan
            </button>
          </form>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.eventType.trim()) {
              setShowForm(true);
              return;
            }
            handleSubmit(e);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder={showForm ? 'Or type your message...' : 'Describe your event...'}
            value={showForm ? '' : form.eventType}
            onChange={(e) => {
              if (!showForm) {
                setForm((prev) => ({ ...prev, eventType: e.target.value }));
              }
            }}
            onKeyDown={(e) => {
              if (!showForm && e.key === 'Enter' && form.eventType.trim()) {
                handleSubmit(e);
              }
            }}
            className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="p-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
