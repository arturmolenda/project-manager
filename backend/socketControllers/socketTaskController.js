import Task from '../models/task.js';
import List from '../models/list.js';
import mongoose from 'mongoose';

export const socketTaskController = (io, socket) => {
  // @desc Create new task
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

  // @desc Drag task to other list or within the same list
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

  // @desc Archive single task
  socket.on('task-archive', async (data) => {
    const { projectId, taskId, listIndex } = data;
    socket.to(projectId).emit('task-archived', { taskId, listIndex });
    await List.updateOne(
      { projectId },
      {
        $pull: {
          [`lists.${listIndex}.tasks`]: taskId,
        },
        $push: {
          archivedTasks: {
            $each: [taskId],
            $position: 0,
          },
        },
      }
    );
    await Task.updateOne({ _id: taskId }, { $set: { archived: true } });
  });

  // @desc Delete archived task
  socket.on('task-delete', async (data) => {
    const { projectId, taskId } = data;
    const lists = await List.updateOne(
      { projectId },
      {
        $pull: {
          archivedTasks: taskId,
        },
      },
      { returnOriginal: false }
    )
      .populate('lists.tasks')
      .populate('archivedTasks');

    socket.to(projectId).emit('lists-update', lists);
    await Task.findOneAndDelete({ _id: taskId });
  });

  // @desc Archive all tasks within single list
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
      lists.archivedTasks = [...tasks, ...lists.archivedTasks];
    }
    await lists.save();
    const newLists = await List.findOne({ projectId })
      .populate('lists.tasks')
      .populate('archivedTasks');
    socket.to(projectId).emit('lists-update', newLists);
  });

  // @desc Transfer task to other list or within one list or from archive | available in archive or in task modal
  socket.on('task-transfer', async (data) => {
    const { projectId, taskId, listIndex, newListIndex } = data;
    // if listIndex is undefined then function is called from archived tasks
    if (listIndex) {
      await List.findOneAndUpdate(
        { projectId },
        {
          $pull: { [`lists.${listIndex}.tasks`]: taskId },
          $push: { [`lists.${newListIndex}.tasks`]: taskId },
        }
      );
    } else {
      await List.findOneAndUpdate(
        { projectId },
        {
          $pull: { archivedTasks: taskId },
          $push: { [`lists.${newListIndex}.tasks`]: taskId },
        }
      );
      await Task.findOneAndUpdate(
        { _id: taskId },
        { $set: { archived: false } }
      );
    }
    const newLists = await List.findOne({ projectId })
      .populate('lists.tasks')
      .populate('archivedTasks');
    socket.to(projectId).emit('lists-update', newLists);
  });

  // @desc Transfer all tasks within particular list to other list
  socket.on('tasks-transfer', async (data) => {
    const { projectId, listIndex, newListIndex } = data;
    const lists = await List.findOne({ projectId });
    const tasks = lists.lists[listIndex].tasks.splice(
      0,
      lists.lists[listIndex].tasks.length
    );
    if (tasks.length > 0) {
      lists.lists[newListIndex].tasks = [
        ...lists.lists[newListIndex].tasks,
        ...tasks,
      ];
    }
    await lists.save();
    const newLists = await List.findOne({ projectId })
      .populate('lists.tasks')
      .populate('archivedTasks');
    socket.to(projectId).emit('lists-update', newLists);
  });
};
