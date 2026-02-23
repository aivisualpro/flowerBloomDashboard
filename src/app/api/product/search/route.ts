import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product } from '@/models';
import '@/models';

// GET /api/product/search — Full product search with filters, sorting, and pagination
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    // Search & text
    const q = searchParams.get('q');
    
    // Filters
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const occasion = searchParams.get('occasion');
    const recipient = searchParams.get('recipient');
    const color = searchParams.get('color');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const stockStatus = searchParams.get('stockStatus');
    const isFeatured = searchParams.get('isFeatured');
    
    // Sorting
    const sort = searchParams.get('sort') || 'newest';
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = { isActive: true };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { ar_title: { $regex: q, $options: 'i' } },
        { sku: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (category) {
      const ids = category.split(',');
      filter.categories = { $in: ids };
    }
    if (brand) {
      filter.brand = brand;
    }
    if (occasion) {
      const ids = occasion.split(',');
      filter.occasions = { $in: ids };
    }
    if (recipient) {
      const ids = recipient.split(',');
      filter.recipients = { $in: ids };
    }
    if (color) {
      const ids = color.split(',');
      filter.colors = { $in: ids };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (stockStatus && stockStatus !== 'all') {
      filter.stockStatus = stockStatus;
    }
    if (isFeatured === 'true') {
      filter.isFeatured = true;
    }

    // Build sort
    let sortObj: any = {};
    switch (sort) {
      case 'oldest': sortObj = { createdAt: 1 }; break;
      case 'price_asc': sortObj = { price: 1 }; break;
      case 'price_desc': sortObj = { price: -1 }; break;
      case 'best_selling': sortObj = { totalPieceSold: -1 }; break;
      case 'name_asc': sortObj = { title: 1 }; break;
      case 'name_desc': sortObj = { title: -1 }; break;
      default: sortObj = { createdAt: -1 }; break;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('brand')
        .populate('categories')
        .populate('occasions')
        .populate('recipients')
        .populate('colors')
        .sort(sortObj)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
