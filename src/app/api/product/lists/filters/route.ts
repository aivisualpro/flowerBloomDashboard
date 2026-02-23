import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Category, Brand, Occasion, Recipient, Color, Packaging, CategoryType, SubCategory } from '@/models';
import '@/models';

// GET /api/product/lists/filters — Returns all filter options for the product listing page
export async function GET() {
  try {
    await connectDB();

    const [categories, subCategories, brands, occasions, recipients, colors, packagingOptions, categoryTypes] = await Promise.all([
      Category.find({ isActive: true }).select('name ar_name slug image').sort({ name: 1 }),
      SubCategory.find({ isActive: true }).select('name ar_name slug category image').populate('category', 'name slug').sort({ name: 1 }),
      Brand.find({ isActive: true }).select('name ar_name slug countryCode image').sort({ name: 1 }),
      Occasion.find({ isActive: true }).select('name ar_name slug image').sort({ name: 1 }),
      Recipient.find({ isActive: true }).select('name ar_name slug image').sort({ name: 1 }),
      Color.find({ isActive: true }).select('name ar_name mode value').sort({ name: 1 }),
      Packaging.find({ isActive: true }).select('name ar_name price image').sort({ name: 1 }),
      CategoryType.find({ isActive: true }).select('name ar_name slug').sort({ name: 1 })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        categories,
        subCategories,
        brands,
        occasions,
        recipients,
        colors,
        packagingOptions,
        categoryTypes,
        priceRange: { min: 0, max: 5000, currency: 'QAR' },
        sortOptions: [
          { value: 'newest', label: 'Newest First' },
          { value: 'oldest', label: 'Oldest First' },
          { value: 'price_asc', label: 'Price: Low to High' },
          { value: 'price_desc', label: 'Price: High to Low' },
          { value: 'best_selling', label: 'Best Selling' },
          { value: 'name_asc', label: 'Name: A to Z' },
          { value: 'name_desc', label: 'Name: Z to A' }
        ]
      }
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
