import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import mongoose from 'mongoose';

const pexelsMap = {
  'Royal Wedding Celebration': 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=800&h=500&fit=crop',
  'Birthday Bash - Neon Night': 'https://images.pexels.com/photos/1456242/pexels-photo-1456242.jpeg?w=800&h=500&fit=crop',
  'Tech Summit 2026': 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?w=800&h=500&fit=crop',
  'College Fest - Euphoria': 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=800&h=500&fit=crop',
  'Diwali Festival of Lights': 'https://images.pexels.com/photos/2693524/pexels-photo-2693524.jpeg?w=800&h=500&fit=crop',
  'Golden Anniversary Gala': 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?w=800&h=500&fit=crop',
  'New Year Eve Party 2027': 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?w=800&h=500&fit=crop',
  'Starry Night Wedding Reception': 'https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?w=800&h=500&fit=crop',
  'Kids Birthday Carnival': 'https://images.pexels.com/photos/1729784/pexels-photo-1729784.jpeg?w=800&h=500&fit=crop',
  'Startup Meetup & Networking': 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=800&h=500&fit=crop',
  'Holi Color Festival': 'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?w=800&h=500&fit=crop',
  'Retro 90s Night Party': 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?w=800&h=500&fit=crop',
};

try {
  await mongoose.connect('mongodb+srv://chiranthansiddu20_db_user:%40Chiranth9591323326@cluster0.lyykz16.mongodb.net/ai-event-manager?retryWrites=true&w=majority');
  console.log('Connected to MongoDB');
  let updated = 0;
  for (const [title, imageUrl] of Object.entries(pexelsMap)) {
    const result = await mongoose.connection.db.collection('events').updateOne(
      { title },
      { $set: { images: [imageUrl] } }
    );
    if (result.modifiedCount > 0) {
      console.log(`Updated: ${title}`);
      updated++;
    }
  }
  console.log(`Updated ${updated} events with Pexels images`);
  await mongoose.disconnect();
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
