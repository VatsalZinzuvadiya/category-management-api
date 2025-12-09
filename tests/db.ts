import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

// Set a global timeout for all tests
jest.setTimeout(120000);

export const connect = async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: { version: '6.0.5' }, // Using a specific version to avoid long downloads
  });
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

export const closeDatabase = async () => {
  if (mongoServer) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  }
};

export const clearDatabase = async () => {
  if (mongoServer) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
};
