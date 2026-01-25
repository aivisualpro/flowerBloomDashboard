import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Occasion from '@/models/Occasion';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const occasion = await Occasion.findByIdAndDelete(id);

        if (!occasion) {
            return NextResponse.json({ success: false, message: 'Occasion not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Occasion deleted' });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
