import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import projectRoutes from './routes/projects.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serving uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
  res.send('Alomawy Backend is running');
});
app.use('/api/projects', projectRoutes);

// MongoDB Connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast if connection issues
      socketTimeoutMS: 45000, // Close sockets after 45s
    });
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

// Ensure connection before handling requests (middleware approach)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
