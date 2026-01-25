import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Recipient from '@/models/Recipient';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const recipient = await Recipient.findByIdAndDelete(id);

        if (!recipient) {
            return NextResponse.json({ success: false, message: 'Recipient not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Recipient deleted' });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
