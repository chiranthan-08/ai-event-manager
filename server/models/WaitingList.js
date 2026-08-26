import mongoose from 'mongoose';

const waitingListSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Client reference is required'],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Organizer reference is required'],
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    preferredTime: {
      type: String,
      trim: true,
    },
    eventDetails: {
      title: { type: String, trim: true },
      category: { type: String, trim: true },
      description: { type: String, trim: true },
      venue: { type: String, trim: true },
      capacity: { type: Number },
    },
    position: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['waiting', 'notified', 'promoted', 'expired', 'cancelled'],
        message: '{VALUE} is not a valid waiting list status',
      },
      default: 'waiting',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

waitingListSchema.index({ organizer: 1, eventDate: 1, status: 1 });
waitingListSchema.index({ client: 1, status: 1 });

const WaitingList = mongoose.model('WaitingList', waitingListSchema);

export default WaitingList;
