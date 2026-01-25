import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Brand from '@/models/Brand';

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
        const countryCode = formData.get('countryCode') as string;
        const image = formData.get('image') || formData.get('logo');
        const isActive = formData.get('isActive') === 'true';
        let slug = formData.get('slug') as string;
        
        if (!slug && name) {
            slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        const updateData: any = {
            name,
            ar_name,
            slug,
            countryCode,
            isActive
        };

        if (typeof image === 'object' && image !== null && (image as any).size !== undefined && (image as any).arrayBuffer) {
            const { uploadToCloudinary } = await import('@/lib/cloudinary');
            updateData.image = await uploadToCloudinary(image as unknown as File);
        } else if (typeof image === 'string') {
            updateData.image = image;
        }

        const brand = await Brand.findByIdAndUpdate(id, updateData, { new: true });

        if (!brand) {
            return NextResponse.json({ success: false, message: 'Brand not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: brand });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
