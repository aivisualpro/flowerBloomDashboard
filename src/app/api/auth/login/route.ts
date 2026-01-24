import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        password: hashedPassword,
        role: 'admin'
      });
      
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      success: true,
      token,
      data: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
