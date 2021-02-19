import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    comment: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, required: false, ref: 'User' },
  },
  { timestamps: true }
);

const taskSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false, default: '' },
    deadline: { type: Date, required: false },
    author: { type: String, required: true },
    archived: { type: Boolean, required: false, default: false },
    comments: [commentSchema],
    users: [{ type: mongoose.Types.ObjectId, required: false, ref: 'User' }],
    usersWatching: [
      { type: mongoose.Types.ObjectId, required: false, ref: 'User' },
    ],
    labels: [{ type: mongoose.Types.ObjectId, required: false }],
    toDoLists: {
      totalTasks: { type: Number, default: 0 },
      tasksCompleted: { type: Number, default: 0 },
      lists: [
        { type: mongoose.Types.ObjectId, required: false, ref: 'ToDoList' },
      ],
    },
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
