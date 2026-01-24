import mongoose from 'mongoose';

const PackagingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ar_name: { type: String },
  price: { type: Number, default: 0 },
  image: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Packaging || mongoose.model('Packaging', PackagingSchema);
