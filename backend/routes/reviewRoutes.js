import express from 'express';
import Review from '../models/reviewModel.js';
import Place from '../models/placeModel.js';
import User from '../models/userModel.js'; // Import model User

const router = express.Router();

// Add admin middleware
const adminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    if (!decoded.isAdmin) return res.status(403).json({ message: 'Admin only' });
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all reviews for a place
router.get('/place/:placeId', async (req, res) => {
  try {
    const reviews = await Review.find({ placeId: req.params.placeId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific review
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new review
router.post('/', async (req, res) => {
  try {
    const { placeId, userId, userName, userProfile, rating, comment, visitDate, restaurantName } = req.body;

    let targetPlaceId = placeId;

    // Check if the restaurant already exists by name
    if (!targetPlaceId) {
      const existingPlace = await Place.findOne({ name: restaurantName });
      if (existingPlace) {
        targetPlaceId = existingPlace._id;
      } else {
        // Create a new place if it doesn't exist
        const newPlace = new Place({
          name: restaurantName,
          category: req.body.category || 'Restaurant',
          description: `User-submitted ${req.body.category || 'Restaurant'}.`,
          address: req.body.address || 'Unknown location',
          priceRange: req.body.priceRange || '$$',
          city: req.body.city || 'Jakarta',
          images: ['https://via.placeholder.com/500x300?text=No+Image'],
          overallRating: rating,
          reviewCount: 1,
        });
        const savedPlace = await newPlace.save();
        targetPlaceId = savedPlace._id;
      }
    }

    // Create a new review
    const review = new Review({
      placeId: targetPlaceId,
      userId,
      userName,
      userProfile,
      rating,
      comment,
      visitDate,
    });

    const savedReview = await review.save();

    // Update the place's overall rating and review count
    const place = await Place.findById(targetPlaceId);
    if (place) {
      const reviews = await Review.find({ placeId: targetPlaceId });
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const overallRating = totalRating / reviews.length;

      await Place.findByIdAndUpdate(targetPlaceId, {
        overallRating: parseFloat(overallRating.toFixed(1)),
        reviewCount: reviews.length,
      });
    }

    // Update the user's reviewsCount and XP
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.reviewsCount += 1; // Increment reviews count
        user.xp += 10; // Add 10 XP for each review
        await user.save(); // Save the updated user
      }
    }

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a review
router.put('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Update the place's overall rating
    const reviews = await Review.find({ placeId: review.placeId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const overallRating = totalRating / reviews.length;
    
    await Place.findByIdAndUpdate(review.placeId, {
      overallRating: parseFloat(overallRating.toFixed(1)),
      reviewCount: reviews.length
    });
    
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a review
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Update the place's overall rating
    const reviews = await Review.find({ placeId: review.placeId });
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const overallRating = totalRating / reviews.length;
      
      await Place.findByIdAndUpdate(review.placeId, {
        overallRating: parseFloat(overallRating.toFixed(1)),
        reviewCount: reviews.length
      });
    } else {
      await Place.findByIdAndUpdate(review.placeId, {
        overallRating: 0,
        reviewCount: 0
      });
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Delete any review
router.delete('/admin/:id', adminMiddleware, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    // Update the place's overall rating
    const reviews = await Review.find({ placeId: review.placeId });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const overallRating = totalRating / reviews.length;
      await Place.findByIdAndUpdate(review.placeId, {
        overallRating: parseFloat(overallRating.toFixed(1)),
        reviewCount: reviews.length
      });
    } else {
      await Place.findByIdAndUpdate(review.placeId, {
        overallRating: 0,
        reviewCount: 0
      });
    }
    res.json({ message: 'Review deleted by admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
