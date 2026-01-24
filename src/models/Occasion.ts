import mongoose from 'mongoose';

const OccasionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ar_name: { type: String },
  slug: { type: String, required: true, unique: true },
  image: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Occasion || mongoose.model('Occasion', OccasionSchema);
