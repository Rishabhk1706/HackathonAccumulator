import mongoose from 'mongoose';

const matchRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  maxTeamSize: {
    type: Number,
    required: true,
    min: [1, 'Team must have at least one member']
  },
  lookingForRoles: [{type: String, trim: true}],
  skills: [{type: String, trim: true}],                                                         //changed this line 11-07
  applicants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: {type: String},
    description: {type: String, trim: true},
    appliedAt: { type: Date, default: Date.now }
  }],
  selectedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: {
    type: String,
    enum: ['Pending', 'Full', 'Past'],                                                                   //updated 15-07
    default: 'Pending'
  }
}, { timestamps: true });


matchRequestSchema.methods.isTeamFull = function () {
  return this.selectedUsers.length >= this.maxTeamSize;
};

import Event from './Event.js';                                                                 //updated 15-07
matchRequestSchema.pre('save', async function (next) {
  try {
    const event = await Event.findById(this.event);
    if (event && event.startDate < new Date()) {
      this.status = 'Past';
    } else {
      this.status = this.isTeamFull() ? 'Full' : 'Pending';
    }
    next();
  } catch (err) {
    console.error('Error in matchRequest pre-save:', err);
    next(err);
  }
});

matchRequestSchema.virtual('requestId').get(function () {
  return this._id.toHexString();
});
matchRequestSchema.set('toJSON', { virtuals: true });
matchRequestSchema.set('toObject', { virtuals: true });

export default mongoose.model('MatchRequest', matchRequestSchema)