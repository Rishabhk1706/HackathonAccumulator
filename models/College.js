import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  domain: { type: String, match: /^[a-zA-Z0-9.-]+\.(ac\.in|edu|edu\.in)$/i },
  location: { type: String },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('College', collegeSchema)