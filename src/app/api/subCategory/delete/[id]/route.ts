import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SubCategory from '@/models/SubCategory';

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = await params;
        const subCategory = await SubCategory.findByIdAndDelete(id);

        if (!subCategory) {
            return NextResponse.json({ success: false, message: 'SubCategory not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'SubCategory deleted' });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
