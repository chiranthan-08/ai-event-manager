import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">AI Event Manager</span>
            </Link>
            <p className="text-gray-600 text-sm max-w-md">
              AI-powered event management system that helps you plan, organize, and execute
              unforgettable events with smart recommendations and visualization.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-gray-600 hover:text-primary-600 text-sm">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/decorations" className="text-gray-600 hover:text-primary-600 text-sm">
                  Decorations
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 text-sm">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-primary-600 text-sm">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} AI Event Manager. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
