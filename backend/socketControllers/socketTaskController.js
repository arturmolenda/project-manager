import Task from '../models/task.js';
import List from '../models/list.js';
import mongoose from 'mongoose';

export const socketTaskController = (io, socket) => {
  socket.on('add-task', async (data, callback) => {
    const taskId = mongoose.Types.ObjectId();
    const createdTask = new Task({
      _id: taskId,
      title: data.title,
      description: '',
      deadline: null,
      comments: [],
      labels: [],
      users: [],
      author: socket.user.username,
      creatorId: socket.user._id,
      projectId: data.projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    io.to(data.projectId).emit('new-task', {
      task: createdTask,
      listId: data.listId,
    });

    callback();

    await List.findOneAndUpdate(
      { projectId: data.projectId, 'lists._id': data.listId },
      { $push: { [`lists.$.tasks`]: taskId } }
    );
    await createdTask.save();
  });

  socket.on('task-move', async (data) => {
    const { removed, added, taskId, projectId } = data;
    let lists;
    if (removed.listIndex === added.listIndex) {
      await List.updateOne(
        { projectId },
        {
          $pull: {
            [`lists.${removed.listIndex}.tasks`]: taskId,
          },
        }
      );
      lists = await List.findOneAndUpdate(
        { projectId },
        {
          $push: {
            [`lists.${added.listIndex}.tasks`]: {
              $each: [taskId],
              $position: added.index,
            },
          },
        },
        { returnOriginal: false }
      )
        .populate('lists.tasks')
        .populate('archivedTasks');
    } else {
      lists = await List.findOneAndUpdate(
        { projectId },
        {
          $pull: {
            [`lists.${removed.listIndex}.tasks`]: taskId,
          },
          $push: {
            [`lists.${added.listIndex}.tasks`]: {
              $each: [taskId],
              $position: added.index,
            },
          },
        },
        { returnOriginal: false }
      )
        .populate('lists.tasks')
        .populate('archivedTasks');
    }
    socket.to(projectId).emit('lists-update', lists);
  });
  socket.on('task-archive', async (data, callback) => {
    const { projectId, taskId, listIndex } = data;
    socket.to(projectId).emit('task-archived', { taskId, listIndex });
    await List.updateOne(
      { projectId },
      {
        $pull: {
          [`lists.${listIndex}.tasks`]: taskId,
        },
        $push: { archivedTasks: taskId },
      }
    );
    await Task.updateOne({ _id: taskId }, { $set: { archived: true } });
  });
  socket.on('task-delete', async (data, callback) => {
    const { projectId, taskId } = data;
    callback();
    await List.updateOne(
      { projectId },
      {
        $pull: {
          archivedTasks: taskId,
        },
      }
    );
    socket.to(projectId).emit('task-deleted', { taskId, listIndex });
  });
  socket.on('tasks-archive', async (data) => {
    const { projectId, listIndex } = data;
    const lists = await List.findOne({ projectId });
    const tasks = lists.lists[listIndex].tasks.splice(
      0,
      lists.lists[listIndex].tasks.length
    );

    if (tasks.length > 0) {
      await Task.updateMany(
        { _id: { $in: tasks } },
        { $set: { archived: true } },
        { multi: true }
      );
      lists.archivedTasks = [...lists.archivedTasks, ...tasks];
    }
    await lists.save();
    const newLists = await List.findOne({ projectId })
      .populate('lists.tasks')
      .populate('archivedTasks');
    socket.to(projectId).emit('lists-update', newLists);
  });
};
