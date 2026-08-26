import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    return false;
  }
};

const dbConnected = await connectDB();

// Seed database if empty
if (dbConnected) {
  const User = (await import('./models/User.js')).default;
  const Event = (await import('./models/Event.js')).default;
  const Employee = (await import('./models/Employee.js')).default;
  const Decoration = (await import('./models/Decoration.js')).default;

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('Seeding database with sample data...');

    const admin = await User.create({ name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' });
    const emp1 = await User.create({ name: 'Priya Sharma', email: 'priya@example.com', password: 'employee123', role: 'employee' });
    const emp2 = await User.create({ name: 'Rahul Verma', email: 'rahul@example.com', password: 'employee123', role: 'employee' });
    await User.create({ name: 'Test Client', email: 'client@example.com', password: 'client123', role: 'client' });

    const emp1Profile = await Employee.create({ user: emp1._id, name: emp1.name, role: 'Event Coordinator', specialization: 'Weddings & Anniversaries', experience: 5, bio: 'Expert in elegant wedding ceremonies.' });
    const emp2Profile = await Employee.create({ user: emp2._id, name: emp2.name, role: 'Event Manager', specialization: 'Corporate Events & Festivals', experience: 7, bio: 'Specializes in large-scale corporate events.' });

    const eventData = [
      { title: 'Royal Wedding Celebration', description: 'A grand wedding celebration featuring traditional decorations, live music, and gourmet catering.', category: 'Wedding', date: new Date('2026-09-15T18:00:00'), time: '6:00 PM', venue: 'Grand Palace Banquet Hall', location: 'Bangalore, Karnataka', ticketPrice: 2500, capacity: 500, images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp1Profile._id] },
      { title: 'Birthday Bash - Neon Night', description: 'An electrifying neon-themed birthday party with glow-in-the-dark decorations and DJ nights.', category: 'Birthday', date: new Date('2026-09-20T20:00:00'), time: '8:00 PM', venue: 'Neon Lounge Club', location: 'Mumbai, Maharashtra', ticketPrice: 800, capacity: 200, images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp2Profile._id] },
      { title: 'Tech Summit 2026', description: 'Annual corporate technology summit featuring industry leaders, workshops, and networking.', category: 'Corporate', date: new Date('2026-10-05T09:00:00'), time: '9:00 AM', venue: 'Innovation Convention Center', location: 'Hyderabad, Telangana', ticketPrice: 5000, capacity: 1000, images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp1Profile._id] },
      { title: 'College Fest - Euphoria', description: 'The biggest college festival with music, dance competitions, and celebrity appearances.', category: 'College', date: new Date('2026-10-12T10:00:00'), time: '10:00 AM', venue: 'University Ground', location: 'Delhi, NCR', ticketPrice: 300, capacity: 5000, images: ['https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp2Profile._id] },
      { title: 'Diwali Festival of Lights', description: 'Celebrate Diwali with traditional rituals, cultural performances, and fireworks.', category: 'Festival', date: new Date('2026-10-20T17:00:00'), time: '5:00 PM', venue: 'City Auditorium', location: 'Pune, Maharashtra', ticketPrice: 500, capacity: 800, images: ['https://images.unsplash.com/photo-1606503153255-59d8b2e4b9e4?w=800'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp1Profile._id] },
      { title: 'Golden Anniversary Gala', description: 'Elegant 50th anniversary celebration with live orchestra and gourmet dinner.', category: 'Anniversary', date: new Date('2026-11-01T19:00:00'), time: '7:00 PM', venue: 'Heritage Resort', location: 'Goa', ticketPrice: 3500, capacity: 150, images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp2Profile._id] },
      { title: 'New Year Eve Party 2027', description: 'Ring in the New Year with live DJ, fireworks at midnight, and premium drinks.', category: 'Party', date: new Date('2026-12-31T21:00:00'), time: '9:00 PM', venue: 'Skyline Rooftop', location: 'Bangalore, Karnataka', ticketPrice: 4000, capacity: 300, images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp1Profile._id] },
      { title: 'Starry Night Wedding Reception', description: 'Beautiful starry-night themed wedding reception under the stars with fairy lights.', category: 'Wedding', date: new Date('2026-11-10T19:00:00'), time: '7:00 PM', venue: 'Lakeside Resort', location: 'Udaipur, Rajasthan', ticketPrice: 3000, capacity: 400, images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp2Profile._id] },
      { title: 'Kids Birthday Carnival', description: 'Fun-filled carnival with rides, games, magic shows, and face painting.', category: 'Birthday', date: new Date('2026-09-28T11:00:00'), time: '11:00 AM', venue: 'Fun World Park', location: 'Chennai, Tamil Nadu', ticketPrice: 400, capacity: 300, images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp1Profile._id] },
      { title: 'Startup Meetup & Networking', description: 'Connect with founders, investors, and tech enthusiasts. Pitch sessions and panels.', category: 'Corporate', date: new Date('2026-10-25T14:00:00'), time: '2:00 PM', venue: 'CoWork Space Hub', location: 'Bangalore, Karnataka', ticketPrice: 1500, capacity: 250, images: ['https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp2Profile._id] },
      { title: 'Holi Color Festival', description: 'Celebrate the festival of colors with organic gulal, DJ music, and water guns.', category: 'Festival', date: new Date('2027-03-10T10:00:00'), time: '10:00 AM', venue: 'Open Ground Arena', location: 'Mathura, Uttar Pradesh', ticketPrice: 250, capacity: 2000, images: ['https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp1Profile._id] },
      { title: 'Retro 90s Night Party', description: 'Step back in time with classic hits, neon lights, denim jackets, and nostalgia.', category: 'Party', date: new Date('2026-11-20T20:00:00'), time: '8:00 PM', venue: 'Vinyl Bar & Lounge', location: 'Mumbai, Maharashtra', ticketPrice: 1200, capacity: 180, images: ['https://images.unsplash.com/photo-1504509546545-e009b53fba3e?w=800'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp2Profile._id] },
    ];

    const events = await Event.insertMany(eventData);

    await Decoration.insertMany([
      { title: 'Wedding Floral Arch', category: 'Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', description: 'Beautiful floral arch for weddings', event: events[0]._id },
      { title: 'Birthday Balloon Setup', category: 'Birthday', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600', description: 'Colorful balloon decoration', event: events[1]._id },
      { title: 'Diwali Rangoli Display', category: 'Festival', image: 'https://images.unsplash.com/photo-1606503153255-59d8b2e4b9e4?w=600', description: 'Traditional rangoli for Diwali', event: events[4]._id },
      { title: 'DJ Night Lighting', category: 'Party', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600', description: 'Neon and laser lighting for parties', event: events[6]._id },
      { title: 'Corporate Stage Design', category: 'Corporate', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600', description: 'Professional stage setup', event: events[2]._id },
    ]);

    const { seedAddOns } = await import('./controllers/addOnController.js');
    await seedAddOns();

    console.log('Database seeded: 4 users, 12 events, 2 employees, 5 decorations, 40+ add-ons');
    console.log('Accounts: admin@example.com / admin123, priya@example.com / employee123, client@example.com / client123');
  } else {
    console.log('Database already has data, skipping seed.');
  }
}

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server running', dbConnected: dbConnected, timestamp: new Date().toISOString() });
});

// Routes
const authRoutes = (await import('./routes/auth.js')).default;
const eventRoutes = (await import('./routes/events.js')).default;
const employeeRoutes = (await import('./routes/employees.js')).default;
const registrationRoutes = (await import('./routes/registrations.js')).default;
const paymentRoutes = (await import('./routes/payments.js')).default;
const dashboardRoutes = (await import('./routes/dashboard.js')).default;
const aiRoutes = (await import('./routes/ai.js')).default;
const decorationRoutes = (await import('./routes/decorations.js')).default;
const addOnRoutes = (await import('./routes/addOns.js')).default;

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/decorations', decorationRoutes);
app.use('/api/add-ons', addOnRoutes);

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\nAI Event Manager Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`\nDefault accounts:`);
  console.log(`   Admin:    admin@example.com / admin123`);
  console.log(`   Employee: priya@example.com / employee123`);
  console.log(`   Client:   client@example.com / client123\n`);
});

export default app;
