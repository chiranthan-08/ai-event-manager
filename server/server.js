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
  const Registration = (await import('./models/Registration.js')).default;
  const Payment = (await import('./models/Payment.js')).default;

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('Seeding database with sample data...');

    const admin = await User.create({ name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' });
    const emp1 = await User.create({ name: 'Priya Sharma', email: 'priya@example.com', password: 'employee123', role: 'employee' });
    const emp2 = await User.create({ name: 'Rahul Verma', email: 'rahul@example.com', password: 'employee123', role: 'employee' });
    const client1 = await User.create({ name: 'Sonu Kumar', email: 'sonu@example.com', password: 'client123', role: 'client' });
    const client2 = await User.create({ name: 'Anita Devi', email: 'anita@example.com', password: 'client123', role: 'client' });
    const client3 = await User.create({ name: 'Vikram Singh', email: 'vikram@example.com', password: 'client123', role: 'client' });
    const client4 = await User.create({ name: 'Neha Gupta', email: 'neha@example.com', password: 'client123', role: 'client' });
    const testClient = await User.create({ name: 'Test Client', email: 'client@example.com', password: 'client123', role: 'client' });

    const emp1Profile = await Employee.create({ user: emp1._id, name: emp1.name, role: 'Event Coordinator', specialization: 'Weddings & Anniversaries', experience: 5, bio: 'Expert in elegant wedding ceremonies.', assignedEvents: [] });
    const emp2Profile = await Employee.create({ user: emp2._id, name: emp2.name, role: 'Event Manager', specialization: 'Corporate Events & Festivals', experience: 7, bio: 'Specializes in large-scale corporate events.', assignedEvents: [] });

    const eventData = [
      { title: 'Royal Wedding Celebration', description: 'A grand wedding celebration featuring traditional decorations, live music, and gourmet catering.', category: 'Wedding', date: new Date('2026-09-15T18:00:00'), time: '6:00 PM', venue: 'Grand Palace Banquet Hall', location: 'Bangalore, Karnataka', ticketPrice: 2500, capacity: 500, images: ['https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=800&h=500&fit=crop'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp1Profile._id] },
      { title: 'Birthday Bash - Neon Night', description: 'An electrifying neon-themed birthday party with glow-in-the-dark decorations and DJ nights.', category: 'Birthday', date: new Date('2026-09-20T20:00:00'), time: '8:00 PM', venue: 'Neon Lounge Club', location: 'Mumbai, Maharashtra', ticketPrice: 800, capacity: 200, images: ['https://images.pexels.com/photos/1456242/pexels-photo-1456242.jpeg?w=800&h=500&fit=crop'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp2Profile._id] },
      { title: 'Tech Summit 2026', description: 'Annual corporate technology summit featuring industry leaders, workshops, and networking.', category: 'Corporate', date: new Date('2026-10-05T09:00:00'), time: '9:00 AM', venue: 'Innovation Convention Center', location: 'Hyderabad, Telangana', ticketPrice: 5000, capacity: 1000, images: ['https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?w=800&h=500&fit=crop'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp1Profile._id] },
      { title: 'College Fest - Euphoria', description: 'The biggest college festival with music, dance competitions, and celebrity appearances.', category: 'College', date: new Date('2026-10-12T10:00:00'), time: '10:00 AM', venue: 'University Ground', location: 'Delhi, NCR', ticketPrice: 300, capacity: 5000, images: ['https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=800&h=500&fit=crop'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp2Profile._id] },
      { title: 'Diwali Festival of Lights', description: 'Celebrate Diwali with traditional rituals, cultural performances, and fireworks.', category: 'Festival', date: new Date('2026-10-20T17:00:00'), time: '5:00 PM', venue: 'City Auditorium', location: 'Pune, Maharashtra', ticketPrice: 500, capacity: 800, images: ['https://images.pexels.com/photos/2693524/pexels-photo-2693524.jpeg?w=800&h=500&fit=crop'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp1Profile._id] },
      { title: 'Golden Anniversary Gala', description: 'Elegant 50th anniversary celebration with live orchestra and gourmet dinner.', category: 'Anniversary', date: new Date('2026-11-01T19:00:00'), time: '7:00 PM', venue: 'Heritage Resort', location: 'Goa', ticketPrice: 3500, capacity: 150, images: ['https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?w=800&h=500&fit=crop'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp2Profile._id] },
      { title: 'New Year Eve Party 2027', description: 'Ring in the New Year with live DJ, fireworks at midnight, and premium drinks.', category: 'Party', date: new Date('2026-12-31T21:00:00'), time: '9:00 PM', venue: 'Skyline Rooftop', location: 'Bangalore, Karnataka', ticketPrice: 4000, capacity: 300, images: ['https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?w=800&h=500&fit=crop'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp1Profile._id] },
      { title: 'Starry Night Wedding Reception', description: 'Beautiful starry-night themed wedding reception under the stars with fairy lights.', category: 'Wedding', date: new Date('2026-11-10T19:00:00'), time: '7:00 PM', venue: 'Lakeside Resort', location: 'Udaipur, Rajasthan', ticketPrice: 3000, capacity: 400, images: ['https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?w=800&h=500&fit=crop'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp2Profile._id] },
      { title: 'Kids Birthday Carnival', description: 'Fun-filled carnival with rides, games, magic shows, and face painting.', category: 'Birthday', date: new Date('2026-09-28T11:00:00'), time: '11:00 AM', venue: 'Fun World Park', location: 'Chennai, Tamil Nadu', ticketPrice: 400, capacity: 300, images: ['https://images.pexels.com/photos/1729784/pexels-photo-1729784.jpeg?w=800&h=500&fit=crop'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp1Profile._id] },
      { title: 'Startup Meetup & Networking', description: 'Connect with founders, investors, and tech enthusiasts. Pitch sessions and panels.', category: 'Corporate', date: new Date('2026-10-25T14:00:00'), time: '2:00 PM', venue: 'CoWork Space Hub', location: 'Bangalore, Karnataka', ticketPrice: 1500, capacity: 250, images: ['https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=800&h=500&fit=crop'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp2Profile._id] },
      { title: 'Holi Color Festival', description: 'Celebrate the festival of colors with organic gulal, DJ music, and water guns.', category: 'Festival', date: new Date('2027-03-10T10:00:00'), time: '10:00 AM', venue: 'Open Ground Arena', location: 'Mathura, Uttar Pradesh', ticketPrice: 250, capacity: 2000, images: ['https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?w=800&h=500&fit=crop'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp1Profile._id] },
      { title: 'Retro 90s Night Party', description: 'Step back in time with classic hits, neon lights, denim jackets, and nostalgia.', category: 'Party', date: new Date('2026-11-20T20:00:00'), time: '8:00 PM', venue: 'Vinyl Bar & Lounge', location: 'Mumbai, Maharashtra', ticketPrice: 1200, capacity: 180, images: ['https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?w=800&h=500&fit=crop'], status: 'upcoming', createdBy: admin._id, assignedEmployees: [emp2Profile._id] },
    ];

    const events = await Event.insertMany(eventData);

    // Assign events to employees' assignedEvents arrays
    const emp1EventIds = events.filter(e => e.assignedEmployees.some(ae => ae.equals(emp1Profile._id))).map(e => e._id);
    const emp2EventIds = events.filter(e => e.assignedEmployees.some(ae => ae.equals(emp2Profile._id))).map(e => e._id);

    await Employee.findByIdAndUpdate(emp1Profile._id, { assignedEvents: emp1EventIds });
    await Employee.findByIdAndUpdate(emp2Profile._id, { assignedEvents: emp2EventIds });

    // Create sample registrations with organizer field
    const reg1 = await Registration.create({
      client: client1._id,
      event: events[0]._id,
      organizer: emp1._id,
      numberOfTickets: 4,
      totalAmount: 10000,
      ticketId: 'TKT-WEDDING-001',
      status: 'active',
    });
    const reg2 = await Registration.create({
      client: client2._id,
      event: events[0]._id,
      organizer: emp1._id,
      numberOfTickets: 2,
      totalAmount: 5000,
      ticketId: 'TKT-WEDDING-002',
      status: 'active',
    });
    const reg3 = await Registration.create({
      client: client3._id,
      event: events[2]._id,
      organizer: emp1._id,
      numberOfTickets: 1,
      totalAmount: 5000,
      ticketId: 'TKT-CORP-001',
      status: 'active',
    });
    const reg4 = await Registration.create({
      client: client4._id,
      event: events[4]._id,
      organizer: emp1._id,
      numberOfTickets: 3,
      totalAmount: 1500,
      ticketId: 'TKT-FEST-001',
      status: 'active',
    });
    const reg5 = await Registration.create({
      client: client1._id,
      event: events[1]._id,
      organizer: emp2._id,
      numberOfTickets: 2,
      totalAmount: 1600,
      ticketId: 'TKT-BDAY-001',
      status: 'active',
    });
    const reg6 = await Registration.create({
      client: client2._id,
      event: events[3]._id,
      organizer: emp2._id,
      numberOfTickets: 5,
      totalAmount: 1500,
      ticketId: 'TKT-COLL-001',
      status: 'active',
    });

    // Update available seats
    await Event.findByIdAndUpdate(events[0]._id, { $inc: { availableSeats: -6 } });
    await Event.findByIdAndUpdate(events[2]._id, { $inc: { availableSeats: -1 } });
    await Event.findByIdAndUpdate(events[4]._id, { $inc: { availableSeats: -3 } });
    await Event.findByIdAndUpdate(events[1]._id, { $inc: { availableSeats: -2 } });
    await Event.findByIdAndUpdate(events[3]._id, { $inc: { availableSeats: -5 } });

    // Create sample payments
    await Payment.create({
      client: client1._id,
      event: events[0]._id,
      registration: reg1._id,
      amount: 10000,
      paymentId: 'PAY-WED-001',
      paymentStatus: 'successful',
      paidAt: new Date('2026-08-20'),
    });
    await Payment.create({
      client: client2._id,
      event: events[0]._id,
      registration: reg2._id,
      amount: 5000,
      paymentId: 'PAY-WED-002',
      paymentStatus: 'successful',
      paidAt: new Date('2026-08-21'),
    });
    await Payment.create({
      client: client3._id,
      event: events[2]._id,
      registration: reg3._id,
      amount: 5000,
      paymentId: 'PAY-CORP-001',
      paymentStatus: 'successful',
      paidAt: new Date('2026-08-22'),
    });
    await Payment.create({
      client: client4._id,
      event: events[4]._id,
      registration: reg4._id,
      amount: 1500,
      paymentId: 'PAY-FEST-001',
      paymentStatus: 'pending',
    });
    await Payment.create({
      client: client1._id,
      event: events[1]._id,
      registration: reg5._id,
      amount: 1600,
      paymentId: 'PAY-BDAY-001',
      paymentStatus: 'successful',
      paidAt: new Date('2026-08-23'),
    });
    await Payment.create({
      client: client2._id,
      event: events[3]._id,
      registration: reg6._id,
      amount: 1500,
      paymentId: 'PAY-COLL-001',
      paymentStatus: 'refunded',
      refundedAt: new Date('2026-08-24'),
      refundAmount: 1500,
    });

    await Decoration.insertMany([
      {
        title: 'Royal Floral Mandap', category: 'Wedding', decorationType: 'Floral',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        description: 'Beautiful floral mandap decoration for wedding ceremonies with fresh roses and marigolds.',
        event: events[0]._id,
        priceRange: '₹25,000 - ₹50,000', duration: '1 Day', capacity: '200-500 guests',
        venue: 'Indoor / Outdoor', rating: 4.8, reviews: 124,
        includes: ['Fresh Rose Garland', 'Marigold Strings', 'Backdrop Draping', 'Mandap Setup'],
        designs: ['Classic Rose Arch', 'Marigold Gateway', 'Mixed Floral Mandap'],
        contact: { phone: '+91 98765 43210', email: 'weddings@aievent.com' },
      },
      {
        title: 'Birthday Balloon Arch', category: 'Birthday', decorationType: 'Entrance',
        image: 'https://images.unsplash.com/photo-1741969494307-55394e3e4071?w=600&h=400&fit=crop',
        description: 'Colorful balloon decoration for birthday parties with themed balloon arches.',
        event: events[1]._id,
        priceRange: '₹8,000 - ₹20,000', duration: '1 Day', capacity: '50-150 guests',
        venue: 'Indoor / Outdoor', rating: 4.6, reviews: 89,
        includes: ['Balloon Arch', 'Number Balloons', 'Themed Backdrop', 'Photo Booth Setup'],
        designs: ['Rainbow Theme', 'Princess Castle', 'Super Hero Theme', 'Neon Glow Setup'],
        contact: { phone: '+91 98765 43211', email: 'birthdays@aievent.com' },
      },
      {
        title: 'Corporate LED Stage', category: 'Corporate', decorationType: 'Stage',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
        description: 'Professional LED stage setup for corporate events with branded screens.',
        event: events[2]._id,
        priceRange: '₹1,50,000 - ₹5,00,000', duration: '1-3 Days', capacity: '500-5000 guests',
        venue: 'Indoor Convention Center', rating: 4.9, reviews: 201,
        includes: ['LED Wall Display', 'Professional Sound System', 'Stage Lighting', 'Podium Setup'],
        designs: ['Modern Minimalist', 'Tech Summit Stage', 'Award Night Gala'],
        contact: { phone: '+91 98765 43212', email: 'corporate@aievent.com' },
      },
      {
        title: 'Festival Rangoli Display', category: 'Festival', decorationType: 'Backdrop',
        image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop',
        description: 'Traditional rangoli decoration for Diwali celebrations with diyas and flower petals.',
        event: events[4]._id,
        priceRange: '₹15,000 - ₹35,000', duration: '1 Day', capacity: '100-300 guests',
        venue: 'Indoor / Outdoor', rating: 4.7, reviews: 156,
        includes: ['Rangoli Artwork', 'Brass Diyas', 'Flower Petals', 'LED String Lights'],
        designs: ['Traditional Peacock', 'Lotus Mandala', 'Geometric Pattern'],
        contact: { phone: '+91 98765 43213', email: 'festivals@aievent.com' },
      },
      {
        title: 'DJ Night Lighting Setup', category: 'Party', decorationType: 'Lighting',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop',
        description: 'Neon and laser lighting setup for DJ nights and parties.',
        event: events[6]._id,
        priceRange: '₹30,000 - ₹80,000', duration: '1 Night', capacity: '200-1000 guests',
        venue: 'Indoor Club / Outdoor', rating: 4.5, reviews: 93,
        includes: ['Laser Light Show', 'LED Dance Floor', 'Fog Machine', 'Disco Ball'],
        designs: ['Neon Glow Party', 'Retro Disco Night', 'EDM Festival Setup'],
        contact: { phone: '+91 98765 43215', email: 'parties@aievent.com' },
      },
      {
        title: 'Elegant Table Centerpieces', category: 'Wedding', decorationType: 'Table',
        image: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&h=400&fit=crop',
        description: 'Elegant table centerpieces with candles and flowers for wedding receptions.',
        event: events[0]._id,
        priceRange: '₹5,000 - ₹15,000', duration: '1 Day', capacity: '100-500 guests',
        venue: 'Indoor', rating: 4.7, reviews: 78,
        includes: ['Candle Holders', 'Flower Arrangements', 'Table Runners', 'Place Cards'],
        designs: ['Rose Gold Elegance', 'White Paradise', 'Rustic Charm'],
        contact: { phone: '+91 98765 43216', email: 'tables@aievent.com' },
      },
      {
        title: 'Grand Entrance Welcome Gate', category: 'Wedding', decorationType: 'Entrance',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop',
        description: 'Grand floral entrance gate for wedding ceremonies with fairy lights.',
        event: events[7]._id,
        priceRange: '₹20,000 - ₹45,000', duration: '1 Day', capacity: '200-400 guests',
        venue: 'Indoor / Outdoor', rating: 4.8, reviews: 112,
        includes: ['Floral Arch', 'Fairy Lights', 'Welcome Board', 'Red Carpet'],
        designs: ['Rose Garden Gate', 'Royal Palace Entry', 'Garden Paradise'],
        contact: { phone: '+91 98765 43217', email: 'entrance@aievent.com' },
      },
      {
        title: 'Stage Backdrop Draping', category: 'Corporate', decorationType: 'Backdrop',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
        description: 'Professional stage backdrop with branded draping for corporate events.',
        event: events[9]._id,
        priceRange: '₹10,000 - ₹30,000', duration: '1 Day', capacity: '100-500 guests',
        venue: 'Indoor', rating: 4.6, reviews: 67,
        includes: ['Fabric Draping', 'Brand Logo Display', 'Lighting Setup', 'Stage Border'],
        designs: ['Minimalist Corporate', 'Brand Theme', 'Elegant Professional'],
        contact: { phone: '+91 98765 43218', email: 'backdrops@aievent.com' },
      },
    ]);

    const { seedAddOns } = await import('./controllers/addOnController.js');
    await seedAddOns();

    console.log('Database seeded: 9 users, 12 events, 2 employees, 6 registrations, 6 payments, 8 decorations, 36 add-ons');
    console.log('Accounts: admin@example.com / admin123, priya@example.com / employee123, sonu@example.com / client123');
  } else {
    console.log('Database already has data, skipping seed.');
  }

  // Re-seed add-ons if empty (independent of main seed)
  const AddOn = (await import('./models/AddOn.js')).default;
  const addOnCount = await AddOn.countDocuments();
  if (addOnCount === 0) {
    console.log('Add-ons empty, re-seeding...');
    const { seedAddOns } = await import('./controllers/addOnController.js');
    await seedAddOns();
  }

  // Generate organizerIds for existing employees without one
  const employeesWithoutId = await User.find({ role: 'employee', organizerId: { $exists: false } });
  if (employeesWithoutId.length > 0) {
    console.log(`Generating organizerIds for ${employeesWithoutId.length} existing employees...`);
    for (let i = 0; i < employeesWithoutId.length; i++) {
      const count = await User.countDocuments({ role: 'employee', organizerId: { $exists: true, $ne: null } });
      employeesWithoutId[i].organizerId = `ORG-${String(count + 1).padStart(3, '0')}`;
      await employeesWithoutId[i].save();
    }
    console.log('OrganizerIds generated successfully.');
  }

  // Migrate existing decorations with complete data
  const decCount = await Decoration.countDocuments();
  if (decCount > 0) {
    const decorationUpdates = {
      'Wedding Floral Arch': {
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        description: 'Beautiful floral arch decoration for wedding ceremonies with fresh roses and marigolds. A stunning centerpiece that transforms any venue into a romantic paradise.',
        priceRange: '₹25,000 - ₹50,000', duration: '1 Day', capacity: '200-500 guests',
        venue: 'Indoor / Outdoor', rating: 4.8, reviews: 124,
        includes: ['Fresh Rose Garland', 'Marigold Strings', 'Backdrop Draping', 'Mandap Setup', 'Table Centerpieces', 'Entrance Decoration'],
        designs: ['Classic Rose Arch', 'Marigold Gateway', 'Mixed Floral Mandap', 'Garden Theme Setup'],
        contact: { phone: '+91 98765 43210', email: 'weddings@aievent.com' },
      },
      'Birthday Balloon Setup': {
        image: 'https://images.unsplash.com/photo-1741969494307-55394e3e4071?w=600&h=400&fit=crop',
        description: 'Colorful balloon decoration for birthday parties with themed colors, balloon arches, and photo booth setup. Perfect for kids and adults alike.',
        priceRange: '₹8,000 - ₹20,000', duration: '1 Day', capacity: '50-150 guests',
        venue: 'Indoor / Outdoor', rating: 4.6, reviews: 89,
        includes: ['Balloon Arch', 'Number Balloons', 'Themed Backdrop', 'Ceiling Balloons', 'Photo Booth Setup', 'Banner & Streamers'],
        designs: ['Rainbow Theme', 'Princess Castle', 'Super Hero Theme', 'Neon Glow Setup'],
        contact: { phone: '+91 98765 43211', email: 'birthdays@aievent.com' },
      },
      'Diwali Rangoli Display': {
        image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop',
        description: 'Traditional rangoli decoration for Diwali celebrations with diyas, flower petals, and LED string lights. Authentic festive atmosphere for your celebration.',
        priceRange: '₹15,000 - ₹35,000', duration: '1 Day', capacity: '100-300 guests',
        venue: 'Indoor / Outdoor', rating: 4.7, reviews: 156,
        includes: ['Rangoli Artwork', 'Brass Diyas', 'Flower Petals', 'LED String Lights', 'Toran Decoration', 'Floor Patterns'],
        designs: ['Traditional Peacock Rangoli', 'Lotus Mandala', 'Geometric Pattern', 'Flower Petal Design'],
        contact: { phone: '+91 98765 43213', email: 'festivals@aievent.com' },
      },
      'DJ Night Lighting': {
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop',
        description: 'Neon and laser lighting setup for DJ nights and parties with LED dance floor, fog machine, and professional sound system. Electrify your event.',
        priceRange: '₹30,000 - ₹80,000', duration: '1 Night', capacity: '200-1000 guests',
        venue: 'Indoor Club / Outdoor', rating: 4.5, reviews: 93,
        includes: ['Laser Light Show', 'LED Dance Floor', 'Fog Machine', 'Disco Ball', 'Strobe Lights', 'Sound System'],
        designs: ['Neon Glow Party', 'Retro Disco Night', 'EDM Festival Setup', 'Black Light Theme'],
        contact: { phone: '+91 98765 43215', email: 'parties@aievent.com' },
      },
      'Corporate Stage Design': {
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
        description: 'Professional stage setup for corporate events with LED screens, branded banners, and VIP seating. Make your corporate event stand out.',
        priceRange: '₹1,50,000 - ₹5,00,000', duration: '1-3 Days', capacity: '500-5000 guests',
        venue: 'Indoor Convention Center', rating: 4.9, reviews: 201,
        includes: ['LED Wall Display', 'Professional Sound System', 'Stage Lighting', 'Podium Setup', 'Branded Banners', 'VIP Seating Area'],
        designs: ['Modern Minimalist', 'Tech Summit Stage', 'Award Night Gala', 'Product Launch Setup'],
        contact: { phone: '+91 98765 43212', email: 'corporate@aievent.com' },
      },
    };

    let updated = 0;
    for (const [title, data] of Object.entries(decorationUpdates)) {
      const result = await Decoration.updateOne({ title }, { $set: data });
      if (result.modifiedCount > 0) updated++;
    }
    if (updated > 0) {
      console.log(`Updated ${updated} decorations with complete data.`);
    }
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
const organizerRoutes = (await import('./routes/organizer.js')).default;

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/decorations', decorationRoutes);
app.use('/api/add-ons', addOnRoutes);
app.use('/api/organizer', organizerRoutes);

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
