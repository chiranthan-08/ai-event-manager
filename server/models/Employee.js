import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      trim: true,
      default: 'Event Staff',
    },
    specialization: {
      type: String,
      trim: true,
      default: '',
    },
    experience: {
      type: Number,
      min: [0, 'Experience cannot be negative'],
      default: 0,
    },
    assignedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

employeeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
