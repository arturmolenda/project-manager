import mongoose from 'mongoose';

const labelSchema = mongoose.Schema(
  {
    color: { type: String, required: true },
    title: { type: String, required: true },
    taskIds: [{ type: mongoose.Types.ObjectId, required: false }],
    projectId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Label', labelSchema);
