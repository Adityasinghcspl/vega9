import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  PORT: process.env.PORT || 3000,
  UI_URLS: (process.env.UI_URL || '').split(','),
  SERVER_URL: process.env.SERVER_URL || `http://localhost:${process.env.PORT || 3000}`,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'adityasingh',
  CONNECTION_STRING: process.env.CONNECTION_STRING
};
