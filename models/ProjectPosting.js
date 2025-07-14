import mongoose from 'mongoose';

const projectPostingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true},
  description: { type: String, required: true, trim: true},
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
  requiredRoles: [{
    role: { type: String, required: true},
    description: {type: String, trim: true},
    count: { type: Number, required: true, min: 1 }
  }],
  applicants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String},
    appliedAt: { type: Date, default: Date.now }
  }],
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    time: {
      type: String,
      match: /^((0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM))-(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,                          // 14-07 changed
      required: true
    }
  }],                                                               
  selectedUsers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true, trim: true }
  }],

  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open'
  }
}, { timestamps: true });

// Text search index
projectPostingSchema.index({ title: 'text' });

// Sort index for pagination
projectPostingSchema.index({ createdAt: -1, _id: -1 });


// Virtual field for frontend use
projectPostingSchema.virtual('projectId').get(function () {
  return this._id.toHexString();
});
projectPostingSchema.set('toJSON', { virtuals: true });
projectPostingSchema.set('toObject', { virtuals: true });


// Method to check if all roles are filled
projectPostingSchema.methods.isFull = function () {
  const roleCounts = {};

  for (const entry of this.selectedUsers || []) {
    if (!entry.role) continue;
    roleCounts[entry.role] = (roleCounts[entry.role] || 0) + 1;
  }

  for (const required of this.requiredRoles) {
    const selectedCount = roleCounts[required.role] || 0;
    if (selectedCount < required.count) {
      return false;
    }
  }

  return true;
};


// Auto-update status to 'Closed' if full
projectPostingSchema.pre('save', function (next) {
  if (this.isFull()) {
    this.status = 'Closed';
  } else {                                                                            //changed 14-07 added else
    this.status = 'Open';
  }
  next();
});


export default mongoose.model('ProjectPosting', projectPostingSchema)