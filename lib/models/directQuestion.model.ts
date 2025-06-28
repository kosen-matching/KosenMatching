import { ObjectId } from 'mongodb';

// This is now a pure data interface, not a Mongoose model.
export interface IDirectQuestion {
  _id: ObjectId;
  title: string;
  content: string;
  nickname: string;
  email: string; // Not public, for notifications
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  approvedAt?: Date;
  // To link to answers later
  // answers: mongoose.Schema.Types.ObjectId[];
} 