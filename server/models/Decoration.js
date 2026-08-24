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
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
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
