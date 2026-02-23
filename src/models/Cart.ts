import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  price: { type: Number, required: true },
  totalAmount: { type: Number, required: true }
}, { _id: true });

const CartSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
  items: [CartItemSchema],
  subtotal: { type: Number, default: 0 },
  currency: { type: String, default: 'QAR' }
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
