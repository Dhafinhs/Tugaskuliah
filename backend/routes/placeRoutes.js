import express from 'express';
import Place from '../models/placeModel.js';

const router = express.Router();

// Get all places
router.get('/', async (req, res) => {
  try {
    let query = {};
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by price range
    if (req.query.priceRange) {
      query.priceRange = req.query.priceRange;
    }
    
    // Get places
    let places;
    
    // Sort by rating if specified
    if (req.query.sort === 'rating') {
      places = await Place.find(query).sort({ overallRating: -1 });
    } else {
      places = await Place.find(query);
    }
    
    console.log(`Found ${places.length} places from database`);
    
    // If no places found, return sample data for development
    if (places.length === 0) {
      console.log("No places found in DB, returning sample data");
      places = [
        {
          _id: 'sample1',
          name: 'Cafe Delight',
          description: 'A cozy cafe with amazing pastries and coffee',
          address: '123 Main St, Cityville',
          category: 'Cafe',
          priceRange: '$$',
          images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FmZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'],
          overallRating: 4.5,
          reviewCount: 120
        },
        {
          _id: 'sample2',
          name: 'Spice Garden',
          description: 'Authentic Indian cuisine with a modern twist',
          address: '456 Park Avenue, Townsville',
          category: 'Restaurant',
          priceRange: '$$$',
          images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'],
          overallRating: 4.8,
          reviewCount: 210
        },
        {
          _id: 'sample3',
          name: 'Street Bites',
          description: 'The best street food from around the world',
          address: '789 Corner St, Villagetown',
          category: 'Street Food',
          priceRange: '$',
          images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'],
          overallRating: 4.2,
          reviewCount: 85
        }
      ];
    }
    
    res.json(places);
  } catch (error) {
    console.error('Error in GET /api/places:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get places near a location
router.get('/near', async (req, res) => {
  try {
    const { lng, lat, maxDistance = 10000 } = req.query;
    
    if (!lng || !lat) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }
    
    const places = await Place.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });
    
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific place
router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new place
router.post('/', async (req, res) => {
  try {
    const place = new Place(req.body);
    const savedPlace = await place.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a place
router.put('/:id', async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    
    res.json(place);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a place
router.delete('/:id', async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    
    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
