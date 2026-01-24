import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const params = await props.params;
    const id = params.id;
    const formData = await req.formData();
    const data: any = {};
    
    const entries = Array.from(formData.entries());
    for (const [key, value] of entries) {
      let finalValue = value;

      // Check if it's a File and upload it
      if (typeof value === 'object' && (value as any).size !== undefined && (value as any).arrayBuffer) {
         try {
           finalValue = await uploadToCloudinary(value as File);
         } catch (err) {
           console.error(`Failed to upload ${key}`, err);
           continue; 
         }
      }

      const strValue = finalValue as string;

      if (['categories', 'occasions', 'recipients', 'colors', 'type', 'suggestedProducts'].includes(key)) {
        if (!data[key]) data[key] = [];
        data[key].push(strValue);
      } else if (key === 'images') {
        if (!data[key]) data[key] = [];
        data[key].push({ url: strValue });
      } else if (['dimensions', 'typePieces', 'qualities', 'ar_qualities', 'existingImageUrls'].includes(key)) {
        try {
          data[key] = JSON.parse(strValue);
        } catch {
          data[key] = strValue;
        }
      } else {
        data[key] = strValue;
      }
    }

    // Merge existingImageUrls into images
    if (data.existingImageUrls && Array.isArray(data.existingImageUrls)) {
        if (!data.images) data.images = [];
        data.existingImageUrls.forEach((url: string) => {
            data.images.push({ url });
        });
        delete data.existingImageUrls;
    }

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
