const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://chiranthansiddu20_db_user:%40Chiranth9591323326@cluster0.lyykz16.mongodb.net/ai-event-manager?retryWrites=true&w=majority').then(async () => {
  const events = await mongoose.connection.db.collection('events').find({}).project({title:1, images:1, category:1}).toArray();
  console.log(JSON.stringify(events, null, 2));
  mongoose.disconnect();
}).catch(e => { console.error(e); process.exit(1); });
