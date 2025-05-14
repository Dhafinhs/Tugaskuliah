import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userProfile: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/v1580125016/samples/people/boy-snow-hoodie.jpg'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String
  },
  images: [String],
  tags: [String],
  likes: {
    type: Number,
    default: 0
  },
  visitDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for placeId to quickly find all reviews for a place
reviewSchema.index({ placeId: 1 });

// Create index for rating to quickly sort by rating
reviewSchema.index({ rating: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
