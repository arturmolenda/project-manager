import mongoose from 'mongoose';

const messageSchema = mongoose.Schema(
  {
    message: { type: String, required: true },
    username: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    projectId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
