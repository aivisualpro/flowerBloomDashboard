import mongoose from 'mongoose';

const ColorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ar_name: { type: String },
  mode: { type: String },
  value: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Color || mongoose.model('Color', ColorSchema);
