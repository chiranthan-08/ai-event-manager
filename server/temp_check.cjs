const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://chiranthansiddu20_db_user:%40Chiranth9591323326@cluster0.lyykz16.mongodb.net/ai-event-manager?retryWrites=true&w=majority').then(async () => {
  const db = mongoose.connection.db;
  const decs = await db.collection('decorations').find({}).project({title:1, category:1, event:1, image:1}).toArray();
  console.log('Decorations count:', decs.length);
  decs.forEach(d => console.log(' -', d.title, '| cat:', d.category, '| event:', d.event, '| img:', d.image?.substring(0, 50)));
  mongoose.disconnect();
}).catch(e => { console.error(e); process.exit(1); });
