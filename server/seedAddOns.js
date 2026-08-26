import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import { seedAddOns } from './controllers/addOnController.js';

await mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 15000,
});
console.log('Connected to MongoDB');

await seedAddOns();

const AddOn = (await import('./models/AddOn.js')).default;
const count = await AddOn.countDocuments();
console.log('AddOns in DB:', count);

await mongoose.disconnect();
console.log('Done');
