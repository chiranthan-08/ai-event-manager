import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected to MongoDB');

const User = (await import('./models/User.js')).default;
const Event = (await import('./models/Event.js')).default;
const Employee = (await import('./models/Employee.js')).default;
const Registration = (await import('./models/Registration.js')).default;
const Payment = (await import('./models/Payment.js')).default;
const Decoration = (await import('./models/Decoration.js')).default;

// 1. Fix Employee assignedEvents
console.log('\n=== Step 1: Fix Employee assignedEvents ===');
const emp1User = await User.findOne({ email: 'priya@example.com' });
const emp2User = await User.findOne({ email: 'rahul@example.com' });

if (emp1User) {
  const emp1 = await Employee.findOne({ user: emp1User._id });
  if (emp1) {
    const emp1Events = await Event.find({ assignedEmployees: emp1._id });
    emp1.assignedEvents = emp1Events.map(e => e._id);
    await emp1.save();
    console.log(`Priya (${emp1.name}): assignedEvents = ${emp1.assignedEvents.length}`);
  }
}

if (emp2User) {
  const emp2 = await Employee.findOne({ user: emp2User._id });
  if (emp2) {
    const emp2Events = await Event.find({ assignedEmployees: emp2._id });
    emp2.assignedEvents = emp2Events.map(e => e._id);
    await emp2.save();
    console.log(`Rahul (${emp2.name}): assignedEvents = ${emp2.assignedEvents.length}`);
  }
}

// 2. Create sample client if needed
console.log('\n=== Step 2: Ensure sample clients ===');
let client1 = await User.findOne({ email: 'sonu@example.com' });
if (!client1) {
  client1 = await User.create({ name: 'Sonu Kumar', email: 'sonu@example.com', password: 'client123', role: 'client' });
  console.log('Created client: sonu@example.com');
} else {
  console.log('Client sonu@example.com already exists');
}

// 3. Create sample registrations if none exist
console.log('\n=== Step 3: Create sample registrations ===');
const regCount = await Registration.countDocuments();
console.log('Existing registrations:', regCount);

const events = await Event.find().sort({ date: 1 }).limit(6);
const priyaUser = await User.findOne({ email: 'priya@example.com' });
const rahulUser = await User.findOne({ email: 'rahul@example.com' });

if (regCount === 0 && events.length >= 4 && priyaUser) {
  const registrations = [
    { client: client1._id, event: events[0]._id, organizer: priyaUser._id, numberOfTickets: 4, totalAmount: events[0].ticketPrice * 4, ticketId: 'TKT-WED-001', status: 'active' },
    { client: client1._id, event: events[2]._id, organizer: priyaUser._id, numberOfTickets: 2, totalAmount: events[2].ticketPrice * 2, ticketId: 'TKT-CORP-001', status: 'active' },
  ];
  if (events[4]) {
    registrations.push({ client: client1._id, event: events[4]._id, organizer: priyaUser._id, numberOfTickets: 3, totalAmount: events[4].ticketPrice * 3, ticketId: 'TKT-FEST-001', status: 'active' });
  }
  if (rahulUser && events[1]) {
    registrations.push({ client: client1._id, event: events[1]._id, organizer: rahulUser._id, numberOfTickets: 2, totalAmount: events[1].ticketPrice * 2, ticketId: 'TKT-BDAY-001', status: 'active' });
  }
  if (events[3]) {
    registrations.push({ client: client1._id, event: events[3]._id, organizer: rahulUser._id, numberOfTickets: 5, totalAmount: events[3].ticketPrice * 5, ticketId: 'TKT-COLL-001', status: 'active' });
  }

  const createdRegs = await Registration.insertMany(registrations);
  console.log('Created registrations:', createdRegs.length);

  // 4. Create payments for each registration
  const payments = createdRegs.map((r, i) => ({
    client: r.client,
    event: r.event,
    registration: r._id,
    amount: r.totalAmount,
    paymentId: 'PAY-' + String(i + 1).padStart(3, '0'),
    paymentStatus: i < 3 ? 'successful' : (i === 3 ? 'pending' : 'refunded'),
    paidAt: i < 3 ? new Date() : undefined,
  }));
  const createdPayments = await Payment.insertMany(payments);
  console.log('Created payments:', createdPayments.length);
} else {
  console.log('Registrations already exist, skipping.');
}

// 5. Add decorationType to decorations missing it
console.log('\n=== Step 4: Fix decoration types ===');
const decResult = await Decoration.updateMany(
  { decorationType: { $exists: false } },
  { $set: { decorationType: 'Other' } }
);
console.log('Decorations updated with decorationType:', decResult.modifiedCount);

// 6. Verify
console.log('\n=== Verification ===');
const finalEmp1 = await Employee.findOne({ user: emp1User?._id });
const finalEmp2 = await Employee.findOne({ user: emp2User?._id });
console.log('Priya assignedEvents:', finalEmp1?.assignedEvents?.length || 0);
console.log('Rahul assignedEvents:', finalEmp2?.assignedEvents?.length || 0);
console.log('Total registrations:', await Registration.countDocuments());
console.log('Total payments:', await Payment.countDocuments());
console.log('Total decorations:', await Decoration.countDocuments());

console.log('\nMigration complete!');
await mongoose.disconnect();
