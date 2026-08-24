import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (uri) {
      const conn = await mongoose.connect(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    }

    console.log('No MONGODB_URI found. Using in-memory database...');
    
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: { port: 27017 },
      });
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log('In-memory MongoDB started on port 27017');
      return true;
    } catch (memErr) {
      console.log('In-memory MongoDB failed, trying local MongoDB...');
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/ai-event-manager', {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`Local MongoDB Connected: ${conn.connection.host}`);
      return true;
    }
  } catch (error) {
    console.error('All database connections failed:', error.message);
    console.log('Server running without database - API calls will fail');
    return false;
  }
};

export default connectDB;
