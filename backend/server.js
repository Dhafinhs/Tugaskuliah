import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import placeRoutes from './routes/placeRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from './routes/userRoutes.js'; // Import user routes

dotenv.config();

const app = express();

// Add more logging for debugging
console.log('Starting server...');
console.log('Environment variables loaded?', !!process.env.MONGODB_URI);

// Fix CORS with more permissive settings for development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Make sure we can parse JSON bodies
app.use(express.json());

// MongoDB Connection with more logging
console.log('Attempting to connect to MongoDB...');
const mongoUri = process.env.MONGODB_URI;
console.log('Connection string available:', !!mongoUri);

if (!mongoUri) {
  console.error('MONGODB_URI is missing in .env file');
  process.exit(1);
}

// Create default test data if none exists
const createDefaultData = async () => {
  try {
    const Place = mongoose.model('Place');
    const count = await Place.countDocuments();
    
    if (count === 0) {
      console.log('No places found in database. Creating sample data...');
      const samplePlaces = [
        {
          name: 'Cafe Delight',
          description: 'A cozy cafe with amazing pastries and coffee',
          address: '123 Main St, Cityville',
          category: 'Cafe',
          priceRange: '$$',
          images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24'],
          overallRating: 4.5,
          reviewCount: 120
        },
        {
          name: 'Spice Garden',
          description: 'Authentic Indian cuisine with a modern twist',
          address: '456 Park Avenue, Townsville',
          category: 'Restaurant',
          priceRange: '$$$',
          images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'],
          overallRating: 4.8,
          reviewCount: 210
        },
        {
          name: 'Street Bites',
          description: 'The best street food from around the world',
          address: '789 Corner St, Villagetown',
          category: 'Street Food', 
          priceRange: '$',
          images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836'],
          overallRating: 4.2,
          reviewCount: 85
        }
      ];
      
      await Place.insertMany(samplePlaces);
      console.log('✅ Sample data created successfully!');
    } else {
      console.log(`Database already has ${count} places.`);
    }
  } catch (error) {
    console.error('Error creating sample data:', error);
  }
};

// Connect to MongoDB and create default data
mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    createDefaultData();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.error('Connection string starts with:', mongoUri.substring(0, 20) + '...');
  });

// Debug endpoint to check database contents
app.get('/api/debug', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.collections();
    const result = {};
    
    for (const collection of collections) {
      const name = collection.collectionName;
      const count = await collection.countDocuments();
      result[name] = count;
    }
    
    res.json({
      dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      collections: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.use('/api/places', placeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes); // Tambahkan rute untuk pengguna

// Root route with connection status
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 
    ? '✅ Database connected' 
    : '❌ Database disconnected';
  
  res.send(`Place Review API is running<br>${dbStatus}`);
});

// Setup basic test data if DB is empty
app.get('/api/setup-test-data', async (req, res) => {
  try {
    const Place = mongoose.model('Place');
    const count = await Place.countDocuments();
    
    if (count === 0) {
      console.log('Creating sample places...');
      const samplePlaces = [
        {
          name: 'Cafe Delight',
          description: 'A cozy cafe with amazing pastries and coffee',
          address: '123 Main St, Cityville',
          category: 'Cafe',
          priceRange: '$$',
          images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24'],
          overallRating: 4.5,
          reviewCount: 120
        },
        {
          name: 'Spice Garden',
          description: 'Authentic Indian cuisine with a modern twist',
          address: '456 Park Avenue, Townsville',
          category: 'Restaurant',
          priceRange: '$$$',
          images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'],
          overallRating: 4.8,
          reviewCount: 210
        },
        {
          name: 'Street Bites',
          description: 'The best street food from around the world',
          address: '789 Corner St, Villagetown',
          category: 'Street Food', 
          priceRange: '$',
          images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836'],
          overallRating: 4.2,
          reviewCount: 85
        }
      ];
      
      const results = await Place.insertMany(samplePlaces);
      res.json({ message: 'Sample data created!', places: results });
    } else {
      res.json({ message: 'Database already contains data', count });
    }
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`👉 Visit http://localhost:${PORT} to check API status`);
  console.log(`👉 Debug database: http://localhost:${PORT}/api/debug`);
  console.log(`👉 Create test data: http://localhost:${PORT}/api/setup-test-data`);
});
