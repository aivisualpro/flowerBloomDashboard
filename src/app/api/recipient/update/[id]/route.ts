import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Recipient from '@/models/Recipient';

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
        const image = formData.get('image');
        const isActive = formData.get('isActive') === 'true';
        let slug = formData.get('slug') as string;
        
        if (!slug && name) {
            slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        const updateData: any = {
            name,
            ar_name,
            slug,
            isActive
        };

        if (typeof image === 'object' && image !== null && (image as any).size !== undefined && (image as any).arrayBuffer) {
            const { uploadToCloudinary } = await import('@/lib/cloudinary');
            updateData.image = await uploadToCloudinary(image as unknown as File);
        } else if (typeof image === 'string') {
            updateData.image = image;
        }

        const recipient = await Recipient.findByIdAndUpdate(id, updateData, { new: true });

        if (!recipient) {
            return NextResponse.json({ success: false, message: 'Recipient not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: recipient });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
