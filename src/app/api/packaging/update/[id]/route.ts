import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Packaging from '@/models/Packaging';

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const formData = await req.formData();
        
        const name = formData.get('name') as string;
        const ar_name = formData.get('ar_name') as string;
        const price = Number(formData.get('price') || 0);
        const image = formData.get('image');
        const isActive = formData.get('isActive') === 'true';

        const updateData: any = {
            name,
            ar_name,
            price,
            isActive
        };

        if (typeof image === 'object' && image !== null && (image as any).size !== undefined && (image as any).arrayBuffer) {
            const { uploadToCloudinary } = await import('@/lib/cloudinary');
            updateData.image = await uploadToCloudinary(image as unknown as File);
        } else if (typeof image === 'string') {
            updateData.image = image;
        }

        const packaging = await Packaging.findByIdAndUpdate(id, updateData, { new: true });

        if (!packaging) {
            return NextResponse.json({ success: false, message: 'Packaging not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: packaging });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
