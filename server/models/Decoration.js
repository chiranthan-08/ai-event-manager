import mongoose from 'mongoose';

const decorationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Decoration title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
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
      required: [true, 'Decoration category is required'],
    },
    decorationType: {
      type: String,
      enum: {
        values: ['Stage', 'Lighting', 'Floral', 'Table', 'Entrance', 'Backdrop', 'Other'],
        message: '{VALUE} is not a valid decoration type',
      },
      default: 'Other',
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    priceRange: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '',
    },
    capacity: {
      type: String,
      default: '',
    },
    venue: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    includes: [{
      type: String,
    }],
    designs: [{
      type: String,
    }],
    contact: {
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

decorationSchema.index({ category: 1 });
decorationSchema.index({ event: 1 });

decorationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Decoration = mongoose.model('Decoration', decorationSchema);

export default Decoration;
