import Task from '../models/task.js';
import List from '../models/list.js';
import mongoose from 'mongoose';
import { populateLists } from '../utils/utilFunctions.js';

export const socketListController = (io, socket) => {
  // @desc Create new list
  socket.on('add-list', async (data, callback) => {
    const newList = {
      _id: mongoose.Types.ObjectId(),
      title: data.title,
      tasks: [],
    };
    io.to(data.projectId).emit('list-added', {
      list: newList,
    });
    callback();
    await List.updateOne(
      { projectId: data.projectId },
      { $push: { lists: newList } }
    );
  });

  // @desc Change list index by dragging
  socket.on('list-move', async (data) => {
    const { removedIndex, addedIndex, projectId } = data;
    const newLists = await populateLists(projectId);

    const [list] = newLists.lists.splice(removedIndex, 1);
    newLists.lists.splice(addedIndex, 0, list);
    await newLists.save();
    socket.to(projectId).emit('lists-update', { newLists });
  });

  // @desc Update list title
  socket.on('list-title-update', async (data, callback) => {
    const { title, listIndex, projectId } = data;
    callback();
    socket.to(projectId).emit('list-title-updated', { title, listIndex });
    await List.updateOne(
      { projectId },
      { $set: { [`lists.${listIndex}.title`]: title } }
    );
  });

  // @desc Delete list and archive all tasks inside
  socket.on('list-delete', async (data) => {
    const { projectId, listIndex } = data;
    const lists = await List.findOne({ projectId });

    const [deletedList] = lists.lists.splice(listIndex, 1);
    if (deletedList.tasks.length > 0) {
      await Task.updateMany(
        { _id: { $in: deletedList.tasks } },
        { $set: { archived: true } },
        { multi: true }
      );
      lists.archivedTasks = [...lists.archivedTasks, ...deletedList.tasks];
    }
    await lists.save();
    const newLists = await populateLists(projectId);

    socket.to(projectId).emit('lists-update', { newLists });
  });
};
