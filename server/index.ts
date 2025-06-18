import path from 'path';
import cors from 'cors';
import express from 'express';
import connectDb from './src/config/dbConnection';
import userRoutes from './src/routes/userRoutes';
import errorHandler from './src/middlewares/errorHandler';
import { config } from './src/config/config';
import blogRoutes from './src/routes/blogRoutes';

// Connect to the database
connectDb();

// Create an instance of the Express application
const app = express();
const port = config.PORT;;

// Serve static files (e.g. for uploaded profile images)
app.use('/src', express.static(path.join(__dirname, 'src/public')));

// Parse JSON and form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse comma-separated origins from .env
const allowedOrigins = (process.env.UI_URL || '').split(',');

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Log requests
app.use((req, _res, next) => {
  console.log(req.originalUrl);
  next();
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/blog', blogRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
