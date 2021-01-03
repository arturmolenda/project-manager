import mongoose from 'mongoose';

const taskSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    title: { type: String, required: true },
    description: { type: String, required: false, default: '' },
    deadline: { type: Date, required: false },
    author: { type: String, required: true },
    comments: [{ type: Object, required: true }],
    users: [{ type: mongoose.Types.ObjectId, required: false, ref: 'User' }],
    labels: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Label' }],
    creatorId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    projectId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
