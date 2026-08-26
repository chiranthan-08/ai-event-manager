import mongoose from 'mongoose';

const addOnSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Add-on name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    category: {
      type: String,
      enum: {
        values: ['Flowers', 'Food & Snacks', 'Decor', 'Return Gifts', 'Lighting', 'Furniture', 'Tableware', 'Props'],
        message: '{VALUE} is not a valid category',
      },
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    image: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    unit: {
      type: String,
      default: 'per piece',
      enum: ['per piece', 'per kg', 'per set', 'per hour', 'per day', 'per person', 'flat rate'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

addOnSchema.index({ category: 1 });
addOnSchema.index({ name: 'text' });

const AddOn = mongoose.model('AddOn', addOnSchema);

export default AddOn;
