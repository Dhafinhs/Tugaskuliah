import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  xp: {
    type: Number,
    default: 0,
  },
  rank: {
    type: String,
    default: 'Newbie',
  },
}, {
  timestamps: true,
});

// Update rank based on XP
userSchema.pre('save', function (next) {
  if (this.xp < 100) {
    this.rank = 'Newbie';
  } else if (this.xp < 500) {
    this.rank = 'Intermediate';
  } else if (this.xp < 1000) {
    this.rank = 'Expert';
  } else {
    this.rank = 'Master';
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
