import Task from '../models/task.js';
import List from '../models/list.js';
import Notification from '../models/notification.js';
import Project from '../models/project.js';
import Label from '../models/label.js';
import ToDoList from '../models/toDoList.js';
import mongoose from 'mongoose';
import { populateLists, taskPopulation } from '../utils/utilFunctions.js';

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
        .populate({
          path: 'archivedTasks',
          populate: {
            path: 'users',
            select: 'username email profilePicture',
          },
        })
        .populate({
          path: 'archivedTasks',
          populate: {
            path: 'toDoLists.lists',
          },
        });
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
        .populate({
          path: 'archivedTasks',
          populate: {
            path: 'users',
            select: 'username email profilePicture',
          },
        })
        .populate({
          path: 'archivedTasks',
          populate: {
            path: 'toDoLists.lists',
          },
        });
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
    const lists = await List.findOneAndUpdate(
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
      .populate({
        path: 'archivedTasks',
        populate: {
          path: 'users',
          select: 'username email profilePicture',
        },
      })
      .populate({
        path: 'archivedTasks',
        populate: {
          path: 'toDoLists.lists',
        },
      });

    socket.to(projectId).emit('lists-update', { newLists: lists });
    const task = await Task.findOneAndDelete({ _id: taskId });

    // remove taskId from tasks assigned to users and update notifications
    await Notification.deleteMany({ task: taskId });
    if (task.users.length > 0) {
      task.users.forEach(async (user, i) => {
        await Project.updateOne(
          { _id: projectId },
          { $pull: { [`users.${i}.tasksAssigned`]: taskId } }
        );
        io.to(String(user)).emit('notifications-updated');
      });
    }
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
    const newLists = await populateLists(projectId);
    socket.to(projectId).emit('lists-update', { newLists });
  });

  // @desc Transfer task to other list or within one list or from archive | available in archive or in task modal
  socket.on('task-transfer', async (data, callback) => {
    const { projectId, taskId, currentListId, newListId } = data;

    // if listIndex is undefined then function is called from archived tasks
    if (currentListId !== null) {
      let taskIndex;
      const lists = await List.findOne({ projectId });
      const listIndex = lists.lists.findIndex((list) =>
        list._id.equals(currentListId)
      );
      const newListIndex = lists.lists.findIndex((list) =>
        list._id.equals(newListId)
      );
      if (listIndex > -1) {
        taskIndex = lists.lists[listIndex].tasks.indexOf(taskId);
      }

      if (taskIndex > -1 && newListIndex > -1) {
        lists.lists[listIndex].tasks.splice(taskIndex, 1);
        lists.lists[newListIndex].tasks.push(taskId);
        await lists.updateOne(lists);
      }
    } else {
      await List.updateOne(
        { projectId, 'lists._id': newListId },
        {
          $pull: { archivedTasks: taskId },
          $push: { 'lists.$.tasks': taskId },
        }
      );
      await Task.updateOne({ _id: taskId }, { $set: { archived: false } });
    }
    const newLists = await populateLists(projectId);
    if (callback) callback();
    io.to(projectId).emit('lists-update', {
      newLists,
      restoredTaskId: !currentListId && taskId,
    });
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
    const newLists = await populateLists(projectId);
    socket.to(projectId).emit('lists-update', { newLists });
  });

  // @desc Update task's title, deadline or description
  socket.on('task-field-update', async (data, callback) => {
    const { projectId, taskId, updatedData, fieldName } = data;

    const task = await taskPopulation(
      Task.findOneAndUpdate(
        { projectId, _id: taskId },
        { $set: { [fieldName]: updatedData } },
        { returnOriginal: false }
      )
    );
    const newLists = await populateLists(projectId);

    if (fieldName === 'labels') {
      socket.to(projectId).emit('task-updated', { newLists, task });
    } else io.to(projectId).emit('task-updated', { newLists, task });
    if (callback) callback();
  });

  // @desc Update task's assigned users and send/delete notifications
  socket.on('task-users-update', async (data, callback) => {
    const { projectId, taskId, newUsers, removedUsers, addedUsers } = data;

    const task = await taskPopulation(
      Task.findOneAndUpdate(
        { projectId, _id: taskId },
        { $set: { users: newUsers } },
        { returnOriginal: false }
      )
    );

    const newLists = await populateLists(projectId);

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

  // @desc Create new label
  socket.on('create-label', async (data, callback) => {
    const { projectId, taskId, color, title } = data;

    const labelId = new mongoose.Types.ObjectId();
    const createdLabel = {
      color,
      title,
      _id: labelId,
    };
    callback(createdLabel);

    const newLabels = await Label.findOneAndUpdate(
      { projectId },
      {
        $set: { [`labels.${labelId}`]: createdLabel },
        $push: { labelIds: labelId },
      },
      { returnOriginal: false }
    );
    const task = await taskPopulation(
      Task.findOneAndUpdate(
        { _id: taskId },
        {
          $push: { labels: labelId },
        },
        { returnOriginal: false }
      )
    );

    const newLists = await populateLists(projectId);
    socket.to(projectId).emit('labels-updated', { newLabels });
    socket.to(projectId).emit('task-updated', { newLists, task });
  });

  // @desc Delete label
  socket.on('label-delete', async (data) => {
    const { projectId, labelId } = data;

    await Task.updateMany({ projectId }, { $pull: { labels: labelId } });
    const newLabels = await Label.findOneAndUpdate(
      { projectId },
      { $unset: { [`labels.${[labelId]}`]: '' }, $pull: { labelIds: labelId } },
      { returnOriginal: false }
    );

    socket.to(projectId).emit('labels-updated', { newLabels });
  });

  // @desc Edit label
  socket.on('label-edit', async (data) => {
    const { projectId, title, color, labelId } = data;

    const newLabels = await Label.findOneAndUpdate(
      { projectId },
      {
        $set: { [`labels.${[labelId]}.title`]: title },
        $set: { [`labels.${[labelId]}.color`]: color },
      },
      { returnOriginal: false }
    );

    socket.to(projectId).emit('labels-updated', { newLabels });
  });

  // @desc Add To Do List to task
  socket.on('add-to-do-list', async (data, callback) => {
    const { projectId, taskId, title } = data;
    const createdList = await ToDoList.create({
      title,
      tasks: [],
      tasksFinished: 0,
      creatorId: socket.user._id,
      taskId,
    });

    const task = await taskPopulation(
      Task.findOneAndUpdate(
        { _id: taskId },
        { $push: { 'toDoLists.lists': createdList._id } },
        { returnOriginal: false }
      )
    );

    const newLists = await populateLists(projectId);

    callback();
    io.to(projectId).emit('task-updated', { newLists, task });
  });

  // @desc Update to-do list's title
  socket.on('update-to-do-list-title', async (data) => {
    const { projectId, taskId, listId, title } = data;

    await ToDoList.updateOne({ _id: listId }, { $set: { title } });

    const task = await taskPopulation(Task.findById(taskId));

    const newLists = await populateLists(projectId);

    io.to(projectId).emit('lists-update', { newLists });
    socket.to(projectId).emit('task-updated', { task });
  });

  // @desc Delete to-do list
  socket.on('delete-to-do-list', async (data) => {
    const { projectId, taskId, listId } = data;

    const toDoList = await ToDoList.findOneAndDelete({ _id: listId });

    const task = await taskPopulation(
      Task.findOneAndUpdate(
        { _id: taskId },
        {
          $inc: {
            'toDoLists.totalTasks': -toDoList.tasks.length,
            'toDoLists.tasksCompleted': -toDoList.tasksFinished,
          },
        },
        { returnOriginal: false }
      )
    );

    const newLists = await populateLists(projectId);

    io.to(projectId).emit('lists-update', { newLists });
    socket.to(projectId).emit('task-updated', { task });
  });

  // @desc Add To Do task
  socket.on('add-to-do-task', async (data, callback) => {
    const { projectId, taskId, toDoListId, title } = data;
    const createdTask = {
      _id: mongoose.Types.ObjectId(),
      title,
      finished: false,
    };
    callback(createdTask);

    await ToDoList.updateOne(
      { _id: toDoListId },
      { $push: { tasks: createdTask } }
    );

    const task = await taskPopulation(
      Task.findOneAndUpdate(
        { _id: taskId },
        { $inc: { 'toDoLists.totalTasks': 1 } },
        { returnOriginal: false }
      )
    );

    const newLists = await populateLists(projectId);

    io.to(projectId).emit('lists-update', { newLists });
    socket.to(projectId).emit('task-updated', { task });
  });

  // @desc Mark tast as finished or unfinished
  socket.on('update-to-do-task-progress', async (data) => {
    const { projectId, taskId, toDoListId, toDoTaskId, completed } = data;

    await ToDoList.updateOne(
      { _id: toDoListId, 'tasks._id': toDoTaskId },
      {
        $set: { 'tasks.$.finished': completed },
        $inc: { tasksFinished: completed ? 1 : -1 },
      }
    );

    const task = await taskPopulation(
      Task.findOneAndUpdate(
        { _id: taskId },
        { $inc: { 'toDoLists.tasksCompleted': completed ? 1 : -1 } },
        { returnOriginal: false }
      )
    );

    const newLists = await populateLists(projectId);

    io.to(projectId).emit('lists-update', { newLists });
    socket.to(projectId).emit('task-updated', { task });
  });

  // @desc Update to-do task's title
  socket.on('update-to-do-task-title', async (data) => {
    const { projectId, taskId, toDoListId, toDoTaskId, title } = data;

    await ToDoList.updateOne(
      { _id: toDoListId, 'tasks._id': toDoTaskId },
      {
        $set: { 'tasks.$.title': title },
      }
    );

    const task = await taskPopulation(Task.findById(taskId));

    const newLists = await populateLists(projectId);

    io.to(projectId).emit('lists-update', { newLists });
    socket.to(projectId).emit('task-updated', { task });
  });

  // @desc Delete to-do task
  socket.on('delete-to-do-task', async (data) => {
    const { projectId, taskId, toDoListId, toDoTaskId, completed } = data;

    await ToDoList.updateOne(
      { _id: toDoListId },
      {
        $inc: { tasksFinished: completed ? -1 : 0 },
      }
    );

    const task = await taskPopulation(
      Task.findOneAndUpdate(
        { _id: taskId },
        {
          $inc: {
            'toDoLists.tasksCompleted': completed ? -1 : 0,
            'toDoLists.totalTasks': -1,
          },
        },
        { returnOriginal: false }
      )
    );

    const newLists = await populateLists(projectId);

    io.to(projectId).emit('lists-update', { newLists });
    socket.to(projectId).emit('task-updated', { task });
  });

  // @desc Add comment to task
  socket.on('add-comment', async (data, callback) => {
    const { projectId, taskId, comment } = data;
    const currentDate = new Date();
    const createdComment = {
      _id: mongoose.Types.ObjectId(),
      comment,
      user: socket.user._id,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    callback(createdComment);
    const task = await taskPopulation(
      Task.findOneAndUpdate(
        { _id: taskId },
        {
          // workaround to push at the start of an array
          $push: { comments: { $each: [createdComment], $position: 0 } },
        },
        { returnOriginal: false }
      )
    );

    const newLists = await populateLists(projectId);

    io.to(projectId).emit('lists-update', { newLists });
    socket.to(projectId).emit('task-updated', { task });
  });

  // @desc Edit comment
  socket.on('edit-comment', async (data) => {
    const { projectId, taskId, commentId, newComment } = data;

    const task = await taskPopulation(
      Task.findOneAndUpdate(
        { _id: taskId, 'comments._id': commentId },
        {
          $set: { 'comments.$.comment': newComment },
        },
        { returnOriginal: false }
      )
    );

    const newLists = await populateLists(projectId);

    io.to(projectId).emit('lists-update', { newLists });
    socket.to(projectId).emit('task-updated', { task });
  });

  // @desc Delete comment
  socket.on('delete-comment', async (data) => {
    const { projectId, taskId, commentId } = data;

    const task = await taskPopulation(
      Task.findOneAndUpdate(
        { _id: taskId },
        {
          $pull: {
            comments: { _id: commentId },
          },
        },
        { returnOriginal: false }
      )
    );

    const newLists = await populateLists(projectId);

    io.to(projectId).emit('lists-update', { newLists });
    socket.to(projectId).emit('task-updated', { task });
  });
};
