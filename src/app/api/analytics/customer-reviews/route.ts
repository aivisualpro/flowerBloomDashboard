import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Placeholder for real review logic
    const reviews = {
      total: 0,
      labels: ['Poor','Extremely Satisfied','Satisfied','Very Poor'],
      counts: [0,0,0,0],
      percents: [0,0,0,0]
    };

    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
