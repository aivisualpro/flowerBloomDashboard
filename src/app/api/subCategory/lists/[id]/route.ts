import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SubCategory from '@/models/SubCategory';
import '@/models/Category';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('GET /api/subCategory/lists/[id] triggered with id:', (await params).id);
        await connectDB();
        const { id } = await params;
        const subCategory = await SubCategory.findById(id).populate('category');
        
        if (!subCategory) {
            return NextResponse.json({ success: false, message: 'SubCategory not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: subCategory });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
