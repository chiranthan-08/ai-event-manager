import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import mongoose from 'mongoose';

const pexelsMap = {
  'Wedding Floral Arch': 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=600&h=400&fit=crop',
  'Birthday Balloon Setup': 'https://images.pexels.com/photos/5765827/pexels-photo-5765827.jpeg?w=600&h=400&fit=crop',
  'Corporate Stage Design': 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?w=600&h=400&fit=crop',
  'Diwali Rangoli Display': 'https://images.pexels.com/photos/6726362/pexels-photo-6726362.jpeg?w=600&h=400&fit=crop',
  'DJ Night Lighting': 'https://images.pexels.com/photos/1749057/pexels-photo-1749057.jpeg?w=600&h=400&fit=crop',
};

try {
  await mongoose.connect('mongodb+srv://chiranthansiddu20_db_user:%40Chiranth9591323326@cluster0.lyykz16.mongodb.net/ai-event-manager?retryWrites=true&w=majority');
  console.log('Connected to MongoDB');
  let updated = 0;
  for (const [title, imageUrl] of Object.entries(pexelsMap)) {
    const result = await mongoose.connection.db.collection('decorations').updateOne(
      { title },
      { $set: { image: imageUrl } }
    );
    if (result.modifiedCount > 0) {
      console.log(`Updated: ${title}`);
      updated++;
    }
  }
  console.log(`Updated ${updated} decorations with Pexels images`);
  await mongoose.disconnect();
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
