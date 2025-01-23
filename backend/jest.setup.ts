import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { config } from 'dotenv';
let mongoServer: MongoMemoryServer;
config({ path: './.env.test' });
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  mongoose.set("strictQuery", false);
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
