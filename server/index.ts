import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import mapsRouter from './routes/maps.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fracture-map';

app.use(express.json());
app.use('/api/maps', mapsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

