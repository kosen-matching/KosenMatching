import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required.'],
    match: [/.+\@.+\..+/, 'Please enter a valid email.'],
  },
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = models.User || mongoose.model('User', UserSchema);

export default User; 