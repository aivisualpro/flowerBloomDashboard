import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  payment: { 
    type: String, 
    enum: ['paid', 'pending', 'failed'],
    default: 'pending'
  },
  amount: { type: Number, required: true },
  grandTotal: { type: Number },
  taxAmount: { type: Number, default: 0 },
  shippingAmount: { type: Number, default: 0 },
  placedAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
  cancelReason: { type: String },
  appliedCoupon: {
    code: String,
    type: String,
    value: Number
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalAmount: { type: Number, required: true }
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: String,
  transactionId: String
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
