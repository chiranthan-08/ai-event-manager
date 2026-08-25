import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Send, Loader2, Lightbulb, Palette, DollarSign, MapPin, Star, Phone, Calendar, Mic, MicOff, Volume2, VolumeX, Globe } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import api from '../../services/api';

const LANGUAGES = [
  { code: 'en-US', label: 'English', short: 'EN' },
  { code: 'kn-IN', label: 'Kannada', short: 'KN' },
  { code: 'hi-IN', label: 'Hindi', short: 'HI' },
  { code: 'ta-IN', label: 'Tamil', short: 'TA' },
  { code: 'ml-IN', label: 'Malayalam', short: 'ML' },
];

const AIAssistant = ({ standalone = true }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Namaste! Welcome to AI Event Manager. I'm your personal AI event planning assistant powered by Grok.\n\nI can help you with:\n\nWeddings - From intimate to royal celebrations\nBirthdays - Kids to milestone parties\nCorporate - Annual days, launches, conferences\nFestivals - Diwali, Holi, and more\nVenues - Best places for your event\nDecorations - Theme ideas and pricing\nBudget Planning - Smart cost estimates\n\nJust tell me what you're planning!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLang.code;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [selectedLang]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLang.code;
    }
  }, [selectedLang]);

  const speak = useCallback((text) => {
    if (!window.speechSynthesis || !autoSpeak) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[^\w\s.,!?;:'-]/g, '').trim();
    if (!clean) return;
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = selectedLang.code;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }, [autoSpeak, selectedLang]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Speech recognition error:', e);
      }
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setInput('');
    setMessages(updatedMessages);
    setLoading(true);

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    try {
      const apiMessages = updatedMessages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .slice(-20)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await api.post('/ai/chat', { messages: apiMessages });
      const reply = response.data?.reply || "Sorry, I couldn't process that. Please try again.";

      const assistantMsg = { role: 'assistant', content: reply };
      setMessages(prev => [...prev, assistantMsg]);
      setTimeout(() => speak(reply), 150);
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting to the AI service. Please try again in a moment."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    { icon: Lightbulb, title: 'Wedding Planning', prompt: 'Help me plan a wedding for 200 guests, budget 5 lakh' },
    { icon: Palette, title: 'Corporate Event', prompt: 'Suggest decorations for a corporate annual day for 500 people' },
    { icon: DollarSign, title: 'Birthday Party', prompt: 'Plan a birthday party for 50 guests, budget 50000' },
    { icon: MapPin, title: 'Venue Search', prompt: 'Suggest venues for a wedding in Bangalore' },
    { icon: Star, title: 'Theme Ideas', prompt: 'What are the best decoration themes?' },
    { icon: Calendar, title: 'Festival Event', prompt: 'Plan a Diwali celebration event' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50 via-white to-green-50">
      {standalone && <Navbar />}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>AI Event Assistant</h1>
          <p className="text-gray-600 mt-2">Powered by Grok AI - Ask me anything about event planning</p>
          <p className="text-gray-400 mt-1 text-sm">Type or use the microphone to speak</p>
        </div>

        {messages.length <= 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {suggestions.map((s, i) => {
              const Icon = s.icon;
              return (
                <button
                  key={i}
                  onClick={() => { setInput(s.prompt); }}
                  className="bg-white rounded-2xl p-4 text-left hover:shadow-lg transition-all border border-gray-100"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">{s.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{s.prompt}</p>
                </button>
              );
            })}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 min-h-[400px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50 rounded-t-3xl">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-xs text-gray-500">{isListening ? 'Listening...' : 'Grok AI Online'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`p-1.5 rounded-lg transition-colors ${autoSpeak ? 'bg-saffron-100 text-saffron-600' : 'bg-gray-200 text-gray-500'}`}
                title={autoSpeak ? 'Auto-speak ON' : 'Auto-speak OFF'}
              >
                {autoSpeak ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-saffron-300 text-xs font-medium text-gray-700"
                >
                  <Globe size={12} />{selectedLang.short}
                </button>
                {showLangMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 min-w-[120px]">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { setSelectedLang(lang); setShowLangMenu(false); }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-saffron-50 ${selectedLang.code === lang.code ? 'bg-saffron-50 text-saffron-600 font-bold' : 'text-gray-700'}`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[500px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`rounded-2xl px-5 py-3 ${msg.role === 'user' ? 'bg-gradient-to-r from-saffron-500 to-amber-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-5 py-3 flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-saffron-500" />
                    <span className="text-gray-500 text-sm">Grok is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="border-t border-gray-100 p-4">
            <div className="flex gap-2">
              {recognitionRef.current && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-red-500 text-white shadow-lg animate-pulse'
                      : 'bg-gradient-to-br from-saffron-500 to-amber-500 text-white hover:shadow-lg'
                  }`}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              )}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? 'Listening...' : 'Ask about venues, decorations, themes, pricing...'}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-saffron-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Powered by Grok AI · AI Event Manager</p>
          </form>
        </div>
      </div>
      {standalone && <Footer />}
    </div>
  );
};

export default AIAssistant;
