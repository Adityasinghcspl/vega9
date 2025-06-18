import mongoose from 'mongoose';
import { config } from './config';

const connectDb = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(config.CONNECTION_STRING as string);

    console.log('Database connected:', connection.connection.name);
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

export default connectDb;