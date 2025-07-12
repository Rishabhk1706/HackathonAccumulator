import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true},
  description: { type: String, required: true},
  tags: [{type: String, required: true}],                                                               //removed enum 12-07 
  eventType: { type: String, required: true, enum: ['Virtual', 'In-Person', 'Hybrid']},
  location: { type: String, trim: true},                                                                    // required for offline events (validated below)
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true},
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true},
  maxParticipants: { type: Number, required: true, min: 1},
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  eventStatus: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Past'],
    default: 'Upcoming'
  }
}, { timestamps: true });

eventSchema.index({ tags: 1, location: 1, college: 1, startDate: -1 });                            //1 ascending -1  descending
eventSchema.index({ title: 'text' });
eventSchema.index({ createdAt: -1, _id: -1 });

// Virtual field for `eventId` (alias of `_id`)
eventSchema.virtual('eventId').get(function () {
  return this._id.toHexString();
});
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

// Validate `location` only for offline/hybrid events
eventSchema.pre('validate', function (next) {
  if ((this.eventType === 'In-Person' || this.eventType === 'Hybrid') && !this.location) {
    this.invalidate('location', 'Location is required for In-Person or Hybrid events.');
  }
  next();
});

// Check if max participants limit reached
eventSchema.methods.isFull = function () {
  return this.registeredUsers.length >= this.maxParticipants;
};

//Event Status
eventSchema.pre('save', function (next) {
  const now = new Date();
  if (now < this.startDate) this.eventStatus = 'Upcoming';
  else if (now >= this.startDate && now <= this.endDate) this.eventStatus = 'Ongoing';
  else this.eventStatus = 'Past';
  next();
});

export default mongoose.model('Event', eventSchema)