import Project from '../models/project.js';
import Notification from '../models/notification.js';
import mongoose from 'mongoose';

export const socketProjectController = (io, socket) => {
  socket.on('project-title-update', async (data, callback) => {
    const { title, projectId } = data;
    callback();
    socket.to(projectId).emit('project-title-updated', { title, projectId });
    await Project.updateOne({ _id: projectId }, { $set: { title: title } });
  });

  socket.on('project-invite-users', async (data, callback) => {
    const { projectId, users } = data;

    const project = await Project.findById(projectId);
    if (users.length > 0) {
      const promise = users.map(async (user) => {
        const inviteNotification = new Notification({
          type: 'Project Invitation',
          project: projectId,
          seenDate: null,
          sender: socket.user._id,
          recipient: user._id,
        });
        await inviteNotification.save();
        project.users.push({
          user: user._id,
          permissions: 0,
        });
        io.to(user._id).emit('new-notification');
      });
      Promise.all(promise).then(async () => {
        await project.save();
        const newProjectUsers = await Project.findById(projectId).populate({
          path: 'users.user',
          select: 'username email profilePicture',
        });
        callback();
        io.to(data.projectId).emit('users-updated', newProjectUsers.users);
      });
    }
  });

  socket.on('project-create-join-link', async (data) => {
    const { projectId } = data;
    const joinId = new mongoose.Types.ObjectId();
    io.to(projectId).emit('project-join-link-updated', {
      joinId,
      joinIdActive: true,
    });
    await Project.updateOne(
      { _id: projectId },
      {
        $set: {
          joinId,
          joinIdActive: true,
        },
      }
    );
  });
  socket.on('project-disable-join-link', async (data) => {
    const { projectId } = data;
    io.to(projectId).emit('project-join-link-updated', {
      joinId: null,
      joinIdActive: false,
    });
    await Project.updateOne(
      { _id: projectId },
      { $set: { joinIdActive: false } }
    );
  });
};
