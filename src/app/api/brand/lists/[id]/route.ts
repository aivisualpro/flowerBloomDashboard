import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Brand from '@/models/Brand';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const doc = await Brand.findById(id);
        
        if (!doc) {
            return NextResponse.json({ success: false, message: 'Brand not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: doc });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
