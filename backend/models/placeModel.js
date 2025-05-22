import mongoose from 'mongoose';

const CITY_ENUM = [
  'Jakarta', 'Bogor', 'Depok', 'Tangerang', 'Bekasi', 'Bandung', 'Surabaya', 'Medan', 'Semarang', 'Yogyakarta', 'Bali', 'Makassar', 'Palembang', 'Batam', 'Malang', 'Pekanbaru', 'Samarinda', 'Banjarmasin', 'Pontianak', 'Ambon', 'Kupang', 'Manado', 'Jayapura', 'Mataram', 'Bandar Lampung', 'Cirebon', 'Tasikmalaya', 'Sukabumi', 'Cimahi', 'Tangerang Selatan', 'Lainnya'
];

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true,
    enum: CITY_ENUM,
    default: 'Jakarta'
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['Restaurant', 'Cafe', 'Street Food', 'Bakery', 'Other']
  },
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    default: '$$'
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  overallRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Normalisasi kategori dan gambar default
placeSchema.pre('save', function(next) {
  const validCategories = ['Restaurant', 'Cafe', 'Street Food', 'Bakery', 'Other'];
  if (!validCategories.includes(this.category)) {
    const lowerCategory = this.category.toLowerCase();
    for (const valid of validCategories) {
      if (valid.toLowerCase() === lowerCategory) {
        this.category = valid;
        break;
      }
    }
  }
  if (!this.images || this.images.length === 0) {
    const defaultImages = {
      'Restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
      'Cafe': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
      'Street Food': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
      'Bakery': 'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086',
      'Other': 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17'
    };
    this.images = [defaultImages[this.category] || defaultImages['Other']];
  }
  next();
});

// Indexes
placeSchema.index({ category: 1 });
placeSchema.index({ overallRating: -1 });
placeSchema.index({ 'location.coordinates': '2dsphere' });

const Place = mongoose.model('Place', placeSchema);

export default Place;
