import User from './models/user.js';
import Task from './models/task.js';
import Project from './models/project.js';
import List from './models/list.js';
import mongoose from 'mongoose';
import {
  authorizeSocketConnection,
  levelOneAuth,
  levelTwoAuth,
} from './middleware/socketMiddleware.js';

export const socket = (io) => {
  io.on('connection', async (socket) => {
    // Authorize user upon initial connection
    await authorizeSocketConnection(socket.handshake.auth, socket);
    console.log('Connected users:', io.sockets.server.eio.clientsCount);

    socket.on('join-board', async ({ room }) => {
      // Check is user is part of the project
      await levelOneAuth({ projectId: room }, socket);
      console.log('Joined board', room);
      socket.join(room);
    });

    socket.on('disconnect-board', ({ room }) => {
      console.log('Disconnected-board', room);
      socket.leave(room);
    });

    // Board actions

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
        ).populate('lists.tasks');
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
        ).populate('lists.tasks');
      }
      socket.to(projectId).emit('lists-update', lists);
    });

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

    socket.on('list-move', async (data) => {
      const { removedIndex, addedIndex, projectId } = data;
      const lists = await List.findOne({ projectId }).populate('lists.tasks');
      const [list] = lists.lists.splice(removedIndex, 1);
      lists.lists.splice(addedIndex, 0, list);
      await lists.save();
      socket.to(projectId).emit('lists-update', lists);
    });
  });
  io.on('disconnect', (socket) => {
    console.log('User disconnected.');
  });
};
