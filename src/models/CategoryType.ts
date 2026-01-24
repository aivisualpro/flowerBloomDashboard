import mongoose from 'mongoose';

const CategoryTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ar_name: { type: String },
  slug: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.CategoryType || mongoose.model('CategoryType', CategoryTypeSchema);
