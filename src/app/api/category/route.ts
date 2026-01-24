import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const ar_name = formData.get('ar_name') as string;
    const image = formData.get('image'); // Simplified, should handle file upload

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const category = await Category.create({
      name,
      ar_name,
      slug,
      image: typeof image === 'string' ? image : '' // Placeholder for actual file upload logic
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
