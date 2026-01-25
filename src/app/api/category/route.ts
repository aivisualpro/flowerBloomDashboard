import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const ar_name = formData.get('ar_name') as string;
    const image = formData.get('image');
    const isActive = formData.get('isActive') === 'true';

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    let imageUrl = '';
    if (typeof image === 'object' && image !== null && (image as any).size !== undefined && (image as any).arrayBuffer) {
      const { uploadToCloudinary } = await import('@/lib/cloudinary');
      imageUrl = await uploadToCloudinary(image as unknown as File);
    } else if (typeof image === 'string') {
      imageUrl = image;
    }

    const category = await Category.create({
      name,
      ar_name,
      slug,
      image: imageUrl,
      isActive
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
