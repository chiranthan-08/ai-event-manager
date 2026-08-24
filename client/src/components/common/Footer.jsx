import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Tricolor top border */}
      <div className="h-1 bg-gradient-to-r from-saffron-500 via-white to-indian-green"></div>

      {/* Mandala pattern overlay */}
      <div className="absolute inset-0 mandala-bg opacity-5"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🪔</span>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-saffron-400 to-amber-400 bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif" }}>
                  AI Event Manager
                </h3>
                <p className="text-xs text-gray-400">Celebrate Every Moment</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              India's leading AI-powered event management platform. From grand weddings to intimate celebrations,
              we bring your dream events to life.
            </p>
            <div className="flex gap-4">
              {['facebook', 'instagram', 'twitter', 'youtube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-saffron-500 transition-colors"
                >
                  <span className="text-sm capitalize">{social.charAt(0).toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="text-saffron-500">✦</span> Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'Events', to: '/events' },
                { label: 'Decorations', to: '/decorations' },
                { label: 'AI Assistant', to: '/ai-assistant' },
                { label: 'AI Visualization', to: '/ai-visualize' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-saffron-400 transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-saffron-500 rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="text-indian-gold">✦</span> Categories
            </h4>
            <ul className="space-y-3">
              {['Wedding', 'Birthday', 'Corporate', 'Festival', 'College', 'Party', 'Anniversary'].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/events?category=${cat}`}
                    className="text-gray-400 hover:text-indian-gold transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-indian-gold rounded-full"></span>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="text-indian-green">✦</span> Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 text-indian-green flex-shrink-0 mt-0.5" />
                <span>123 Event Street, MG Road,<br />Bangalore, Karnataka 560001</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-5 h-5 text-indian-green flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-5 h-5 text-indian-green flex-shrink-0" />
                <span>hello@aieventmanager.in</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500"
                />
                <button className="btn-indian text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 AI Event Manager. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in India 🇮🇳
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-saffron-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-saffron-400 text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
