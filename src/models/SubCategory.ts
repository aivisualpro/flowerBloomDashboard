import mongoose from 'mongoose';

const SubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  ar_name: { type: String },
  slug: { type: String, required: true, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.SubCategory || mongoose.model('SubCategory', SubCategorySchema);
