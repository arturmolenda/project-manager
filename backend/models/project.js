import mongoose from 'mongoose';

const projectSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    colorTheme: { type: String, required: false },
    background: {
      color: { type: String, required: false },
      image: { type: String, required: false },
      size: { type: String, required: false, default: 'cover' },
      position: { type: String, required: false, default: 'center' },
      repeat: { type: String, required: false, default: 'no-repeat' },
    },
    users: [
      {
        user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
        permissions: { type: Number, required: true, default: 1 },
        tasksAssigned: [
          { type: mongoose.Types.ObjectId, required: false, ref: 'Task' },
        ],
      },
    ],
    creatorId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    joinId: { type: mongoose.Types.ObjectId, required: true },
    joinIdActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
