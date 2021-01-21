import mongoose from 'mongoose';

const listSchema = mongoose.Schema(
  {
    lists: [
      {
        _id: { type: mongoose.Types.ObjectId, required: true },
        title: { type: String, required: true },
        tasks: [{ type: mongoose.Types.ObjectId, ref: 'Task' }],
      },
    ],
    archivedTasks: [
      { type: mongoose.Types.ObjectId, required: false, ref: 'Task' },
    ],
    projectId: { type: mongoose.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('List', listSchema);
