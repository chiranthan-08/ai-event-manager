import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const User = (await import('./models/User.js')).default;
const Employee = (await import('./models/Employee.js')).default;
const Event = (await import('./models/Event.js')).default;
const Registration = (await import('./models/Registration.js')).default;
const Payment = (await import('./models/Payment.js')).default;

const priya = await User.findOne({ email: 'priya@example.com' });
console.log('User:', priya.name, priya.email, priya.role, priya.organizerId);

const emp = await Employee.findOne({ user: priya._id });
console.log('Employee:', emp.name, 'assignedEvents:', emp.assignedEvents.length);

const events = await Event.find({ _id: { $in: emp.assignedEvents } });
console.log('\nAssigned Events:');
events.forEach(e => console.log(' -', e.title, '|', e.category, '|', e.status));

const regs = await Registration.find({ event: { $in: emp.assignedEvents } }).populate('client', 'name email').populate('event', 'title');
console.log('\nRegistrations:', regs.length);
regs.forEach(r => console.log(' -', r.client?.name, 'booked', r.event?.title, '(' + r.status + ')'));

const eventIds = emp.assignedEvents.map(e => e.toString());
const payments = await Payment.find({ event: { $in: eventIds } }).populate('client', 'name').populate('event', 'title');
console.log('\nPayments:', payments.length);
payments.forEach(p => console.log(' -', p.client?.name, 'paid', p.amount, 'for', p.event?.title, '(' + p.paymentStatus + ')'));

await mongoose.disconnect();
console.log('\nVerification complete!');
