import mongoose from 'mongoose';

const taskSchema = mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, required: true },
  title: { type: String, required: true },
  finished: { type: Boolean, default: false },
});

const toDoListSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    tasksFinished: { type: Number, default: 0 },
    tasks: [taskSchema],
    creatorId: { type: mongoose.Types.ObjectId, required: true },
    taskId: { type: mongoose.Types.ObjectId, required: true },
    projectId: { type: mongoose.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('ToDoList', toDoListSchema);
