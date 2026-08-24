import { Link } from 'react-router-dom';
import { CalendarDays, Sparkles, Users, Shield, ArrowRight } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Suggestions',
      description: 'Get smart recommendations for event planning based on your preferences and budget.',
    },
    {
      icon: CalendarDays,
      title: 'Easy Event Management',
      description: 'Create, manage, and track events with an intuitive dashboard.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Assign employees to events and track their progress in real-time.',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Integrated Razorpay payment gateway for secure transactions.',
    },
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Plan Unforgettable Events with{' '}
              <span className="text-accent-400">AI Power</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8">
              From weddings to corporate events, let artificial intelligence help you
              create the perfect occasion with smart suggestions and stunning visualizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Events
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides all the tools you need to plan,
              organize, and execute successful events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of event planners who are already using AI to create
              amazing experiences.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Free Account
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
