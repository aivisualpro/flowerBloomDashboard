import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Color from '@/models/Color';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const color = await Color.findByIdAndDelete(id);

        if (!color) {
            return NextResponse.json({ success: false, message: 'Color not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Color deleted' });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
