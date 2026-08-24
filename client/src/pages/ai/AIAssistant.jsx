import { useState } from 'react';
import { Sparkles, Send, Loader2, Lightbulb, Palette, DollarSign } from 'lucide-react';
import { getEventSuggestions } from '../../services/aiService';
import toast from 'react-hot-toast';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = [
    {
      icon: Lightbulb,
      title: 'Wedding Planning',
      prompt: 'Help me plan a wedding for 200 guests with a garden theme',
    },
    {
      icon: Palette,
      title: 'Corporate Event',
      prompt: 'Suggest decorations and setup for a corporate annual day',
    },
    {
      icon: DollarSign,
      title: 'Budget Planning',
      prompt: 'Create a budget breakdown for a 500-person conference',
    },
  ];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await getEventSuggestions(input);
      const aiMessage = { role: 'assistant', content: response.data.message || response.data.suggestion };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get AI response');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI Event Assistant</h1>
          <p className="text-gray-600 mt-2">
            Get smart suggestions for planning your perfect event
          </p>
        </div>

        {messages.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.prompt)}
                  className="card text-left hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{suggestion.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{suggestion.prompt}</p>
                </button>
              );
            })}
          </div>
        )}

        <div className="card min-h-[400px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px]">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Ask me anything about event planning, decorations, or budgeting
                </p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about event planning..."
                className="flex-1 input-field"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-primary px-4"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
