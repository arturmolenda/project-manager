import Task from '../models/task.js';
import List from '../models/list.js';
import Notification from '../models/notification.js';
import Project from '../models/project.js';
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
        .populate({
          path: 'lists.tasks',
          populate: {
            path: 'users',
            select: 'username email profilePicture',
          },
        })
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
        .populate({
          path: 'lists.tasks',
          populate: {
            path: 'users',
            select: 'username email profilePicture',
          },
        })
        .populate('archivedTasks');
    }
    socket.to(projectId).emit('lists-update', { newLists: lists });
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
      .populate({
        path: 'lists.tasks',
        populate: {
          path: 'users',
          select: 'username email profilePicture',
        },
      })
      .populate('archivedTasks');

    socket.to(projectId).emit('lists-update', { newLists: lists });
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
      .populate({
        path: 'lists.tasks',
        populate: {
          path: 'users',
          select: 'username email profilePicture',
        },
      })
      .populate('archivedTasks');
    socket.to(projectId).emit('lists-update', { newLists });
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
      .populate({
        path: 'lists.tasks',
        populate: {
          path: 'users',
          select: 'username email profilePicture',
        },
      })
      .populate('archivedTasks');
    socket
      .to(projectId)
      .emit('lists-update', { newLists, restoredTaskId: !listIndex && taskId });
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
      .populate({
        path: 'lists.tasks',
        populate: {
          path: 'users',
          select: 'username email profilePicture',
        },
      })
      .populate('archivedTasks');
    socket.to(projectId).emit('lists-update', { newLists });
  });

  // @desc Update task's title, deadline or description
  socket.on('task-field-update', async (data, callback) => {
    const { projectId, taskId, updatedData, fieldName } = data;

    const task = await Task.findOneAndUpdate(
      { projectId, _id: taskId },
      { $set: { [fieldName]: updatedData } },
      { returnOriginal: false }
    )
      .populate('users')
      .populate('labels');
    const newLists = await List.findOne({ projectId })
      .populate({
        path: 'lists.tasks',
        populate: {
          path: 'users',
          select: 'username email profilePicture',
        },
      })
      .populate('archivedTasks');

    io.to(projectId).emit('task-updated', { newLists, task });
    if (callback) callback();
  });

  // @desc Update task's assigned users and send/delete notifications
  socket.on('task-users-update', async (data, callback) => {
    const { projectId, taskId, newUsers, removedUsers, addedUsers } = data;

    const task = await Task.findOneAndUpdate(
      { projectId, _id: taskId },
      { $set: { users: newUsers } },
      { returnOriginal: false }
    )
      .populate('users')
      .populate('labels');

    const newLists = await List.findOne({ projectId })
      .populate({
        path: 'lists.tasks',
        populate: {
          path: 'users',
          select: 'username email profilePicture',
        },
      })
      .populate('archivedTasks');

    if (callback) callback();
    io.to(projectId).emit('task-updated', { newLists, task });

    const project = await Project.findById(projectId);

    addedUsers.map(async (userId) => {
      const userIndex = project.users.findIndex((x) =>
        x.user._id.equals(userId)
      );
      if (userIndex !== -1) {
        project.users[userIndex].tasksAssigned.push(taskId);
        if (!socket.user._id.equals(userId)) {
          const notification = new Notification({
            type: 'Task Assignment',
            project: projectId,
            task: taskId,
            seenDate: null,
            sender: socket.user._id,
            recipient: userId,
          });
          await notification.save();
          io.to(userId).emit('notifications-updated');
        }
      }
    });
    await project.save();
    removedUsers.map(async (userId) => {
      const userIndex = project.users.findIndex((x) =>
        x.user._id.equals(userId)
      );
      if (userIndex !== -1) {
        const taskIndex = project.users[userIndex].tasksAssigned.indexOf(
          taskId
        );
        if (taskIndex) {
          project.users[userIndex].tasksAssigned.splice(taskIndex, 1);
          await Notification.findOneAndDelete({
            task: taskId,
            type: 'Task Assignment',
          });
          io.to(userId).emit('notifications-updated');
        }
      }
    });
  });
};
