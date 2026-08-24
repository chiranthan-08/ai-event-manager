// In-memory database for development when MongoDB is not available
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

class InMemoryDB {
  constructor() {
    this.users = [];
    this.events = [];
    this.registrations = [];
    this.payments = [];
    this.employees = [];
    this.decorations = [];
    this.nextId = 1;
  }

  generateId() {
    return new mongoose.Types.ObjectId();
  }

  async init() {
    // Create default users
    const adminPass = await bcrypt.hash('admin123', 12);
    const empPass = await bcrypt.hash('employee123', 12);
    const clientPass = await bcrypt.hash('client123', 12);

    const adminId = this.generateId();
    const emp1Id = this.generateId();
    const emp2Id = this.generateId();
    const clientId = this.generateId();

    this.users = [
      { _id: adminId, name: 'Admin User', email: 'admin@example.com', password: adminPass, role: 'admin', profileImage: '', createdAt: new Date() },
      { _id: emp1Id, name: 'Priya Sharma', email: 'priya@example.com', password: empPass, role: 'employee', profileImage: '', createdAt: new Date() },
      { _id: emp2Id, name: 'Rahul Verma', email: 'rahul@example.com', password: empPass, role: 'employee', profileImage: '', createdAt: new Date() },
      { _id: clientId, name: 'Test Client', email: 'client@example.com', password: clientPass, role: 'client', profileImage: '', createdAt: new Date() },
    ];

    // Create employee profiles
    const emp1ProfileId = this.generateId();
    const emp2ProfileId = this.generateId();
    this.employees = [
      { _id: emp1ProfileId, user: emp1Id, name: 'Priya Sharma', role: 'Event Coordinator', specialization: 'Weddings & Anniversaries', experience: 5, bio: 'Expert in elegant wedding ceremonies.', assignedEvents: [], profileImage: '' },
      { _id: emp2ProfileId, user: emp2Id, name: 'Rahul Verma', role: 'Event Manager', specialization: 'Corporate Events & Festivals', experience: 7, bio: 'Specializes in large-scale corporate events.', assignedEvents: [], profileImage: '' },
    ];

    // Create sample events
    const eventData = [
      { title: 'Royal Wedding Celebration', description: 'A grand wedding celebration featuring traditional decorations, live music, and gourmet catering. Experience the magic of a royal-themed wedding.', category: 'Wedding', date: new Date('2026-09-15T18:00:00'), time: '6:00 PM', venue: 'Grand Palace Banquet Hall', location: 'Bangalore, Karnataka', ticketPrice: 2500, capacity: 500, images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800'], status: 'upcoming', createdBy: adminId, assignedEmployees: [emp1ProfileId] },
      { title: 'Birthday Bash - Neon Night', description: 'An electrifying neon-themed birthday party with glow-in-the-dark decorations, DJ nights, and unlimited fun.', category: 'Birthday', date: new Date('2026-09-20T20:00:00'), time: '8:00 PM', venue: 'Neon Lounge Club', location: 'Mumbai, Maharashtra', ticketPrice: 800, capacity: 200, images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800'], status: 'upcoming', createdBy: adminId, assignedEmployees: [emp2ProfileId] },
      { title: 'Tech Summit 2026', description: 'Annual corporate technology summit featuring industry leaders, workshops, and networking.', category: 'Corporate', date: new Date('2026-10-05T09:00:00'), time: '9:00 AM', venue: 'Innovation Convention Center', location: 'Hyderabad, Telangana', ticketPrice: 5000, capacity: 1000, images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'], status: 'upcoming', createdBy: adminId, assignedEmployees: [emp1ProfileId] },
      { title: 'College Fest - Euphoria', description: 'The biggest college festival with music, dance competitions, and celebrity appearances.', category: 'College', date: new Date('2026-10-12T10:00:00'), time: '10:00 AM', venue: 'University Ground', location: 'Delhi, NCR', ticketPrice: 300, capacity: 5000, images: ['https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800'], status: 'upcoming', createdBy: adminId, assignedEmployees: [emp2ProfileId] },
      { title: 'Diwali Festival of Lights', description: 'Celebrate Diwali with traditional rituals, cultural performances, fireworks, and festive food.', category: 'Festival', date: new Date('2026-10-20T17:00:00'), time: '5:00 PM', venue: 'City Auditorium', location: 'Pune, Maharashtra', ticketPrice: 500, capacity: 800, images: ['https://images.unsplash.com/photo-1606503153255-59d8b2e4b9e4?w=800'], status: 'upcoming', createdBy: adminId, assignedEmployees: [emp1ProfileId] },
      { title: 'Golden Anniversary Gala', description: 'Elegant 50th anniversary celebration with live orchestra, gourmet dinner, and personalized decorations.', category: 'Anniversary', date: new Date('2026-11-01T19:00:00'), time: '7:00 PM', venue: 'Heritage Resort', location: 'Goa', ticketPrice: 3500, capacity: 150, images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'], status: 'upcoming', createdBy: adminId, assignedEmployees: [emp2ProfileId] },
      { title: 'New Year Eve Party 2027', description: 'Ring in the New Year with live DJ, fireworks at midnight, and premium drinks package.', category: 'Party', date: new Date('2026-12-31T21:00:00'), time: '9:00 PM', venue: 'Skyline Rooftop', location: 'Bangalore, Karnataka', ticketPrice: 4000, capacity: 300, images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'], status: 'upcoming', createdBy: adminId, assignedEmployees: [emp1ProfileId] },
      { title: 'Starry Night Wedding Reception', description: 'Beautiful starry-night themed wedding reception under the stars with fairy lights.', category: 'Wedding', date: new Date('2026-11-10T19:00:00'), time: '7:00 PM', venue: 'Lakeside Resort', location: 'Udaipur, Rajasthan', ticketPrice: 3000, capacity: 400, images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800'], status: 'upcoming', createdBy: adminId, assignedEmployees: [emp2ProfileId] },
      { title: 'Kids Birthday Carnival', description: 'Fun-filled carnival with rides, games, magic shows, face painting, and goodie bags.', category: 'Birthday', date: new Date('2026-09-28T11:00:00'), time: '11:00 AM', venue: 'Fun World Park', location: 'Chennai, Tamil Nadu', ticketPrice: 400, capacity: 300, images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800'], status: 'upcoming', createdBy: adminId, assignedEmployees: [emp1ProfileId] },
      { title: 'Startup Meetup & Networking', description: 'Connect with founders, investors, and tech enthusiasts. Pitch sessions and panel discussions.', category: 'Corporate', date: new Date('2026-10-25T14:00:00'), time: '2:00 PM', venue: 'CoWork Space Hub', location: 'Bangalore, Karnataka', ticketPrice: 1500, capacity: 250, images: ['https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800'], status: 'upcoming', createdBy: adminId, assignedEmployees: [emp2ProfileId] },
      { title: 'Holi Color Festival', description: 'Celebrate the festival of colors with organic gulal, DJ music, and water guns.', category: 'Festival', date: new Date('2027-03-10T10:00:00'), time: '10:00 AM', venue: 'Open Ground Arena', location: 'Mathura, Uttar Pradesh', ticketPrice: 250, capacity: 2000, images: ['https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800'], status: 'upcoming', createdBy: adminId, assignedEmployees: [emp1ProfileId] },
      { title: 'Retro 90s Night Party', description: 'Step back in time with classic hits, neon lights, denim jackets, and nostalgia.', category: 'Party', date: new Date('2026-11-20T20:00:00'), time: '8:00 PM', venue: 'Vinyl Bar & Lounge', location: 'Mumbai, Maharashtra', ticketPrice: 1200, capacity: 180, images: ['https://images.unsplash.com/photo-1504509546545-e009b53fba3e?w=800'], status: 'upcoming', createdBy: adminId, assignedEmployees: [emp2ProfileId] },
    ];

    this.events = eventData.map(e => ({
      ...e,
      _id: this.generateId(),
      availableSeats: e.capacity,
      createdAt: new Date(),
    }));

    // Create sample decorations
    this.decorations = [
      { _id: this.generateId(), title: 'Wedding Floral Arch', category: 'Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', description: 'Beautiful floral arch for weddings', event: this.events[0]._id, createdAt: new Date() },
      { _id: this.generateId(), title: 'Birthday Balloon Setup', category: 'Birthday', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600', description: 'Colorful balloon decoration', event: this.events[1]._id, createdAt: new Date() },
      { _id: this.generateId(), title: 'Diwali Rangoli Display', category: 'Festival', image: 'https://images.unsplash.com/photo-1606503153255-59d8b2e4b9e4?w=600', description: 'Traditional rangoli for Diwali', event: this.events[4]._id, createdAt: new Date() },
      { _id: this.generateId(), title: 'DJ Night Lighting', category: 'Party', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600', description: 'Neon and laser lighting for parties', event: this.events[6]._id, createdAt: new Date() },
      { _id: this.generateId(), title: 'Corporate Stage Design', category: 'Corporate', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600', description: 'Professional stage setup', event: this.events[2]._id, createdAt: new Date() },
    ];

    console.log('Database initialized with sample data');
    console.log('Users: admin@example.com / admin123, priya@example.com / employee123, client@example.com / client123');
    console.log('Events: ' + this.events.length);
  }

  // User methods
  findUser(query) {
    return this.users.find(u => {
      for (const [key, val] of Object.entries(query)) {
        if (u[key] !== val) return false;
      }
      return true;
    });
  }

  findUserById(id) {
    return this.users.find(u => u._id.toString() === id.toString());
  }

  findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  createUser(data) {
    const user = { ...data, _id: this.generateId(), createdAt: new Date() };
    this.users.push(user);
    return user;
  }

  // Event methods
  findEvents(query = {}) {
    let results = [...this.events];
    if (query.category && query.category !== 'All') {
      results = results.filter(e => e.category === query.category);
    }
    if (query.status) {
      results = results.filter(e => e.status === query.status);
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      results = results.filter(e => e.title.toLowerCase().includes(s) || e.venue.toLowerCase().includes(s) || e.location.toLowerCase().includes(s));
    }
    return results;
  }

  findEventById(id) {
    return this.events.find(e => e._id.toString() === id.toString());
  }

  createEvent(data) {
    const event = { ...data, _id: this.generateId(), createdAt: new Date() };
    this.events.push(event);
    return event;
  }

  updateEvent(id, data) {
    const idx = this.events.findIndex(e => e._id.toString() === id.toString());
    if (idx === -1) return null;
    this.events[idx] = { ...this.events[idx], ...data };
    return this.events[idx];
  }

  deleteEvent(id) {
    const idx = this.events.findIndex(e => e._id.toString() === id.toString());
    if (idx === -1) return false;
    this.events.splice(idx, 1);
    return true;
  }

  // Registration methods
  findRegistrations(query = {}) {
    let results = [...this.registrations];
    if (query.client) results = results.filter(r => r.client.toString() === query.client.toString());
    if (query.event) results = results.filter(r => r.event.toString() === query.event.toString());
    if (query.status) results = results.filter(r => r.status === query.status);
    return results;
  }

  findRegistrationById(id) {
    return this.registrations.find(r => r._id.toString() === id.toString());
  }

  createRegistration(data) {
    const reg = { ...data, _id: this.generateId(), registrationDate: new Date(), createdAt: new Date() };
    this.registrations.push(reg);
    return reg;
  }

  updateRegistration(id, data) {
    const idx = this.registrations.findIndex(r => r._id.toString() === id.toString());
    if (idx === -1) return null;
    this.registrations[idx] = { ...this.registrations[idx], ...data };
    return this.registrations[idx];
  }

  // Payment methods
  findPayment(query = {}) {
    let results = [...this.payments];
    if (query.client) results = results.filter(p => p.client.toString() === query.client.toString());
    if (query.event) results = results.filter(p => p.event.toString() === query.event.toString());
    return results;
  }

  createPayment(data) {
    const payment = { ...data, _id: this.generateId(), createdAt: new Date() };
    this.payments.push(payment);
    return payment;
  }

  updatePayment(id, data) {
    const idx = this.payments.findIndex(p => p._id.toString() === id.toString());
    if (idx === -1) return null;
    this.payments[idx] = { ...this.payments[idx], ...data };
    return this.payments[idx];
  }

  // Employee methods
  findEmployees() { return this.employees; }
  findEmployeeById(id) { return this.employees.find(e => e._id.toString() === id.toString()); }
  findEmployeeByUser(userId) { return this.employees.find(e => e.user.toString() === userId.toString()); }
  createEmployee(data) { const emp = { ...data, _id: this.generateId() }; this.employees.push(emp); return emp; }

  // Decoration methods
  findDecorations(category) {
    if (category) return this.decorations.filter(d => d.category === category);
    return this.decorations;
  }
  createDecoration(data) { const dec = { ...data, _id: this.generateId(), createdAt: new Date() }; this.decorations.push(dec); return dec; }
  deleteDecoration(id) { const idx = this.decorations.findIndex(d => d._id.toString() === id.toString()); if (idx === -1) return false; this.decorations.splice(idx, 1); return true; }

  // Stats
  getStats() {
    return {
      totalUsers: this.users.length,
      totalClients: this.users.filter(u => u.role === 'client').length,
      totalEmployees: this.employees.length,
      totalEvents: this.events.length,
      totalRegistrations: this.registrations.length,
      totalRevenue: this.payments.filter(p => p.paymentStatus === 'successful').reduce((sum, p) => sum + (p.amount || 0), 0),
    };
  }
}

const db = new InMemoryDB();
export default db;
