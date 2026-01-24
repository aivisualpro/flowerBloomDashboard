import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ar_title: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  description: { type: String },
  ar_description: { type: String },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  currency: { type: String, default: 'QAR' },
  totalStocks: { type: Number, default: 0 },
  remainingStocks: { type: Number, default: 0 },
  totalPieceSold: { type: Number, default: 0 },
  stockStatus: { type: String, default: 'in_stock' },
  
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CategoryType' }],
  
  typePieces: [{
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryType' },
    pieces: { type: Number, default: 0 }
  }],
  totalPieceCarry: { type: Number, default: 0 },
  
  occasions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Occasion' }],
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipient' }],
  colors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Color' }],
  packagingOption: { type: mongoose.Schema.Types.ObjectId, ref: 'Packaging' },
  
  condition: { type: String, default: 'new' },
  featuredImage: { type: String },
  images: [{ url: String }],
  
  suggestedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  
  dimensions: {
    width: { type: Number },
    height: { type: Number }
  },
  
  qualities: [String],
  ar_qualities: [String]
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
