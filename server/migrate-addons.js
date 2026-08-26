import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import mongoose from 'mongoose';
import AddOn from './models/AddOn.js';

const uri = 'mongodb+srv://chiranthansiddu20_db_user:%40Chiranth9591323326@cluster0.lyykz16.mongodb.net/ai-event-manager?retryWrites=true&w=majority';

try {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
  const result = await AddOn.deleteMany({});
  console.log(`Deleted ${result.deletedCount} old add-ons. Re-seed will happen on next server start.`);
  await mongoose.disconnect();
  console.log('Done');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
