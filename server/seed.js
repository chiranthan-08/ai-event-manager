import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Employee from './models/Employee.js';
import Event from './models/Event.js';
import Decoration from './models/Decoration.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-event-management';

const categories = ['Wedding', 'Birthday', 'Corporate', 'College', 'Festival', 'Anniversary', 'Party'];
const statuses = ['upcoming', 'active', 'completed'];

const sampleEvents = [
  {
    title: 'Royal Wedding Celebration',
    description: 'A grand wedding celebration featuring traditional decorations, live music, and gourmet catering. Experience the magic of a royal-themed wedding with elegant floral arrangements and stunning lighting.',
    category: 'Wedding',
    date: new Date('2026-09-15T18:00:00'),
    time: '6:00 PM',
    venue: 'Grand Palace Banquet Hall',
    location: 'Bangalore, Karnataka',
    ticketPrice: 2500,
    capacity: 500,
    availableSeats: 500,
    images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800'],
    status: 'upcoming',
  },
  {
    title: 'Birthday Bash - Neon Night',
    description: 'An electrifying neon-themed birthday party with glow-in-the-dark decorations, DJ nights, and unlimited fun. Perfect for celebrating your special day in style.',
    category: 'Birthday',
    date: new Date('2026-09-20T20:00:00'),
    time: '8:00 PM',
    venue: 'Neon Lounge Club',
    location: 'Mumbai, Maharashtra',
    ticketPrice: 800,
    capacity: 200,
    availableSeats: 200,
    images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800'],
    status: 'upcoming',
  },
  {
    title: 'Tech Summit 2026',
    description: 'Annual corporate technology summit featuring industry leaders, workshops, and networking opportunities. Learn about AI, cloud computing, and the future of technology.',
    category: 'Corporate',
    date: new Date('2026-10-05T09:00:00'),
    time: '9:00 AM',
    venue: 'Innovation Convention Center',
    location: 'Hyderabad, Telangana',
    ticketPrice: 5000,
    capacity: 1000,
    availableSeats: 1000,
    images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'],
    status: 'upcoming',
  },
  {
    title: 'College Fest - Euphoria',
    description: 'The biggest college festival of the year! Music performances, dance competitions, art exhibitions, and celebrity guest appearances. Three days of non-stop entertainment.',
    category: 'College',
    date: new Date('2026-10-12T10:00:00'),
    time: '10:00 AM',
    venue: 'University Ground',
    location: 'Delhi, NCR',
    ticketPrice: 300,
    capacity: 5000,
    availableSeats: 5000,
    images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'],
    status: 'upcoming',
  },
  {
    title: 'Diwali Festival of Lights',
    description: 'Celebrate the festival of lights with traditional rituals, cultural performances, fireworks, and delicious festive food. A community celebration of joy and prosperity.',
    category: 'Festival',
    date: new Date('2026-10-20T17:00:00'),
    time: '5:00 PM',
    venue: 'City Auditorium',
    location: 'Pune, Maharashtra',
    ticketPrice: 500,
    capacity: 800,
    availableSeats: 800,
    images: ['https://images.unsplash.com/photo-1606503153255-59d8b2e4b9e4?w=800'],
    status: 'upcoming',
  },
  {
    title: 'Golden Anniversary Gala',
    description: 'A elegant 50th anniversary celebration with live orchestra, gourmet dinner, and personalized decorations. Honoring 50 years of love and togetherness.',
    category: 'Anniversary',
    date: new Date('2026-11-01T19:00:00'),
    time: '7:00 PM',
    venue: 'Heritage Resort',
    location: 'Goa',
    ticketPrice: 3500,
    capacity: 150,
    availableSeats: 150,
    images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'],
    status: 'upcoming',
  },
  {
    title: 'New Year Eve Party 2027',
    description: 'Ring in the New Year with an unforgettable night of music, dance, and celebrations. Live DJ, fireworks at midnight, and premium drinks package included.',
    category: 'Party',
    date: new Date('2026-12-31T21:00:00'),
    time: '9:00 PM',
    venue: 'Skyline Rooftop',
    location: 'Bangalore, Karnataka',
    ticketPrice: 4000,
    capacity: 300,
    availableSeats: 300,
    images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'],
    status: 'upcoming',
  },
  {
    title: 'Wedding Reception - Starry Night',
    description: 'A beautiful starry-night themed wedding reception under the stars. Elegant table settings, fairy lights, and a magical ambiance for an unforgettable evening.',
    category: 'Wedding',
    date: new Date('2026-11-10T19:00:00'),
    time: '7:00 PM',
    venue: 'Lakeside Resort',
    location: 'Udaipur, Rajasthan',
    ticketPrice: 3000,
    capacity: 400,
    availableSeats: 400,
    images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800'],
    status: 'upcoming',
  },
  {
    title: 'Kids Birthday Carnival',
    description: 'A fun-filled carnival for kids with rides, games, magic shows, face painting, and a special birthday cake ceremony. Every child goes home with a goodie bag!',
    category: 'Birthday',
    date: new Date('2026-09-28T11:00:00'),
    time: '11:00 AM',
    venue: 'Fun World Park',
    location: 'Chennai, Tamil Nadu',
    ticketPrice: 400,
    capacity: 300,
    availableSeats: 300,
    images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800'],
    status: 'upcoming',
  },
  {
    title: 'Startup Meetup & Networking',
    description: 'Connect with founders, investors, and tech enthusiasts. Pitch sessions, panel discussions, and networking over coffee. Build your next big idea here.',
    category: 'Corporate',
    date: new Date('2026-10-25T14:00:00'),
    time: '2:00 PM',
    venue: 'CoWork Space Hub',
    location: 'Bangalore, Karnataka',
    ticketPrice: 1500,
    capacity: 250,
    availableSeats: 250,
    images: ['https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800'],
    status: 'upcoming',
  },
  {
    title: 'Holi Color Festival',
    description: 'Celebrate the festival of colors with organic gulal, DJ music, water guns, and thandai. A vibrant celebration of spring and joy!',
    category: 'Festival',
    date: new Date('2027-03-10T10:00:00'),
    time: '10:00 AM',
    venue: 'Open Ground Arena',
    location: 'Mathura, Uttar Pradesh',
    ticketPrice: 250,
    capacity: 2000,
    availableSeats: 2000,
    images: ['https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800'],
    status: 'upcoming',
  },
  {
    title: 'Retro 90s Night Party',
    description: 'Step back in time with our retro 90s themed party. Classic hits, neon lights, denim jackets, and all the nostalgia you can handle!',
    category: 'Party',
    date: new Date('2026-11-20T20:00:00'),
    time: '8:00 PM',
    venue: 'Vinyl Bar & Lounge',
    location: 'Mumbai, Maharashtra',
    ticketPrice: 1200,
    capacity: 180,
    availableSeats: 180,
    images: ['https://images.unsplash.com/photo-1504509546545-e009b53fba3e?w=800'],
    status: 'upcoming',
  },
];

const sampleDecorations = [
  { title: 'Wedding Floral Arch', category: 'Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', description: 'Beautiful floral arch decoration for wedding ceremonies' },
  { title: 'Birthday Balloon Setup', category: 'Birthday', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600', description: 'Colorful balloon decoration for birthday parties' },
  { title: 'Corporate Stage Design', category: 'Corporate', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600', description: 'Professional stage setup for corporate events' },
  { title: 'College Fest Banner', category: 'College', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600', description: 'Vibrant banner and stage decoration for college festivals' },
  { title: 'Diwali Rangoli Display', category: 'Festival', image: 'https://images.unsplash.com/photo-1606503153255-59d8b2e4b9e4?w=600', description: 'Traditional rangoli decoration for Diwali celebrations' },
  { title: 'Anniversary Rose Petals', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600', description: 'Romantic rose petal decoration for anniversary celebrations' },
  { title: 'DJ Night Lighting', category: 'Party', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600', description: 'Neon and laser lighting setup for DJ nights and parties' },
  { title: 'Wedding Mandap Decor', category: 'Wedding', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600', description: 'Traditional Indian wedding mandap decoration' },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Event.deleteMany({});
    await Decoration.deleteMany({});
    console.log('Cleared existing data');

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Created admin: admin@example.com / admin123');

    // Create employees
    const emp1 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: 'employee123',
      role: 'employee',
    });

    const emp2 = await User.create({
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      password: 'employee123',
      role: 'employee',
    });

    const employee1 = await Employee.create({
      user: emp1._id,
      name: 'Priya Sharma',
      role: 'Event Coordinator',
      specialization: 'Weddings & Anniversaries',
      experience: 5,
      bio: 'Expert in planning elegant wedding ceremonies and intimate anniversary celebrations.',
      assignedEvents: [],
    });

    const employee2 = await Employee.create({
      user: emp2._id,
      name: 'Rahul Verma',
      role: 'Event Manager',
      specialization: 'Corporate Events & Festivals',
      experience: 7,
      bio: 'Specializes in large-scale corporate events and cultural festivals.',
      assignedEvents: [],
    });
    console.log('Created 2 employees');

    // Create client
    const client = await User.create({
      name: 'Test Client',
      email: 'client@example.com',
      password: 'client123',
      role: 'client',
    });
    console.log('Created client: client@example.com / client123');

    // Create events
    const createdEvents = [];
    for (let i = 0; i < sampleEvents.length; i++) {
      const empId = i % 2 === 0 ? employee1._id : employee2._id;
      const event = await Event.create({
        ...sampleEvents[i],
        createdBy: admin._id,
        assignedEmployees: [empId],
      });
      createdEvents.push(event);

      // Update employee assigned events
      await Employee.findByIdAndUpdate(empId, {
        $push: { assignedEvents: event._id },
      });
    }
    console.log(`Created ${createdEvents.length} events`);

    // Create decorations
    for (const dec of sampleDecorations) {
      await Decoration.create({
        ...dec,
        event: createdEvents[0]._id,
      });
    }
    console.log(`Created ${sampleDecorations.length} decorations`);

    console.log('\n--- SEED COMPLETE ---');
    console.log('Admin:    admin@example.com / admin123');
    console.log('Employee: priya@example.com / employee123');
    console.log('Employee: rahul@example.com / employee123');
    console.log('Client:   client@example.com / client123');
    console.log('Events:   ' + createdEvents.length);
    console.log('Decorations: ' + sampleDecorations.length);

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Seed error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
