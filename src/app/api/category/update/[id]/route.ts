import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    const formData = await req.formData();
    const updateData: any = {};
    
    if (formData.has('name')) updateData.name = formData.get('name');
    if (formData.has('ar_name')) updateData.ar_name = formData.get('ar_name');
    if (formData.has('image')) updateData.image = formData.get('image');

    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
