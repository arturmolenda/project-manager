import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    type: { type: String, required: true },
    description: { type: String, required: false },
    project: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    listId: { type: mongoose.Types.ObjectId, required: false },
    task: { type: mongoose.Types.ObjectId, required: false, ref: 'Task' },
    seenDate: { type: Date, required: false },
    sender: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    recipient: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
