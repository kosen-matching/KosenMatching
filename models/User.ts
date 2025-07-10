import { Collection, Db, ObjectId } from 'mongodb';

export type UserType = 'student' | 'alumnus' | 'examinee' | 'moderator';

export interface User {
  _id?: ObjectId;
  email: string;
  username: string;
  password?: string;
  profileImageUrl?: string;
  userType: UserType;
  kosenId?: string;
  kosenEmail?: string;
  createdAt: Date;
  showModeratorWelcome?: boolean; // Add this new field
}

export const USERS_COLLECTION = 'users';

export const getUsersCollection = (db: Db): Collection<User> => {
  return db.collection<User>(USERS_COLLECTION);
}; 