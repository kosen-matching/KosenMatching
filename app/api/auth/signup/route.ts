import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getDb } from '@/lib/db';
import { User, getUsersCollection } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

export async function POST(req: Request) {
  try {
    const db = await getDb();
    const usersCollection = getUsersCollection(db);

    const body: Partial<User> = await req.json();
    const { userType, username, email, password, kosenId, kosenEmail } = body;

    // Basic validation
    if (!userType || !username || !email || !password) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (userType === 'student' && (!kosenId || !kosenEmail)) {
        return NextResponse.json({ message: 'kosenId and kosenEmail are required for students' }, { status: 400 });
    }

    if (userType === 'alumnus' && !kosenId) {
        return NextResponse.json({ message: 'kosenId is required for alumni' }, { status: 400 });
    }

    // Check if user already exists
    const existingUserByEmail = await usersCollection.findOne({ email });
    if (existingUserByEmail) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    const existingUserByUsername = await usersCollection.findOne({ username });
    if (existingUserByUsername) {
      return NextResponse.json({ message: 'Username is already taken' }, { status: 409 });
    }

    if (kosenEmail) {
        const existingUserByKosenEmail = await usersCollection.findOne({ kosenEmail });
        if (existingUserByKosenEmail) {
            return NextResponse.json({ message: 'User with this kosen email already exists' }, { status: 409 });
        }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser: Omit<User, '_id'> = {
      userType,
      username,
      email,
      password: hashedPassword,
      kosenId,
      kosenEmail,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // Log in the user by creating a JWT and setting a cookie
    const token = jwt.sign({ userId: result.insertedId }, JWT_SECRET, {
      expiresIn: '1d', // Token expires in 1 day
    });

    const response = NextResponse.json(
      { message: "User created and logged in successfully" },
      { status: 201 }
    );
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
} 