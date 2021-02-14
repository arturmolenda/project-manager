import mongoose from 'mongoose';

const taskSchema = mongoose.Schema({
  title: { type: String, required: true },
  finished: { type: Boolean, default: false },
});

const toDoListSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    usersWithHiddenTasks: [{ type: mongoose.Types.ObjectId, required: false }],
    tasks: [taskSchema],
    creatorId: { type: mongoose.Types.ObjectId, required: true },
    taskId: { type: mongoose.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('ToDoList', toDoListSchema);
