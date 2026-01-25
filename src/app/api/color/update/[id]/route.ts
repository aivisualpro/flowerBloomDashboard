import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Color from '@/models/Color';

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const data = await req.json();
        
        const color = await Color.findByIdAndUpdate(id, data, { new: true });
        
        if (!color) {
            return NextResponse.json({ success: false, message: 'Color not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: color });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
