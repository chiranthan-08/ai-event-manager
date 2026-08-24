import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    category: {
      type: String,
      enum: {
        values: [
          'Wedding',
          'Birthday',
          'Corporate',
          'College',
          'Festival',
          'Anniversary',
          'Party',
          'Other',
        ],
        message: '{VALUE} is not a valid category',
      },
      required: [true, 'Event category is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
      validate: {
        validator(value) {
          return value instanceof Date && !isNaN(value);
        },
        message: 'Please provide a valid date',
      },
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    ticketPrice: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: [0, 'Ticket price cannot be negative'],
    },
    capacity: {
      type: Number,
      required: [true, 'Event capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    availableSeats: {
      type: Number,
      min: [0, 'Available seats cannot be negative'],
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator reference is required'],
    },
    assignedEmployees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
      },
    ],
    status: {
      type: String,
      enum: {
        values: ['upcoming', 'active', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'upcoming',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

eventSchema.pre('save', function (next) {
  if (this.isNew) {
    this.availableSeats = this.capacity;
  }
  next();
});

eventSchema.index({ category: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ category: 1, date: 1, status: 1 });

eventSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
