import mongoose from 'mongoose';
import crypto from 'crypto';

const registrationSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Client reference is required'],
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required'],
    },
    registrationDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    ticketId: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'pending', 'cancelled', 'completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
      required: true,
    },
    numberOfTickets: {
      type: Number,
      required: [true, 'Number of tickets is required'],
      min: [1, 'Must register at least 1 ticket'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

registrationSchema.pre('validate', function (next) {
  if (!this.ticketId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(6).toString('hex').toUpperCase();
    this.ticketId = `TKT-${timestamp}-${random}`;
  }
  next();
});

registrationSchema.index({ client: 1, event: 1 });
registrationSchema.index({ ticketId: 1 });
registrationSchema.index({ event: 1, status: 1 });

registrationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
