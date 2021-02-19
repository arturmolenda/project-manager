import Project from '../models/project.js';
import Notification from '../models/notification.js';
import User from '../models/user.js';
import Task from '../models/task.js';
import generateToken from '../utils/generateToken.js';
import mongoose from 'mongoose';
import { populateLists, taskPopulation } from '../utils/utilFunctions.js';

export const socketProjectController = (io, socket) => {
  // @desc Update project title
  socket.on('project-title-update', async (data, callback) => {
    const { title, projectId } = data;
    callback();
    socket.to(projectId).emit('project-title-updated', { title, projectId });
    await Project.updateOne({ _id: projectId }, { $set: { title: title } });
  });

  // @desc Send invitation to a project
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
        io.to(user._id).emit('notifications-updated');
      });
      Promise.all(promise).then(async () => {
        await project.save();
        const newProjectUsers = await Project.findById(projectId).populate({
          path: 'users.user',
          select: 'username email profilePicture',
        });
        callback();
        io.to(data.projectId).emit(
          'project-users-updated',
          newProjectUsers.users
        );
      });
    }
  });

  // @desc Enable project join link
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

  // @desc Disable project join link
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

  // @desc Adds user to project by invitation either by notification or by join link
  socket.on('project-join', async (data, callback) => {
    const { projectId, joinId } = data;
    let joinSuccess = false;
    const project = await Project.findById(projectId);
    const user = await User.findById(socket.user.id);
    const invitation = await Notification.findOne({
      type: 'Project Invitation',
      project: projectId,
      recipient: socket.user._id,
    });
    const handleInvitation = async () => {
      if (invitation) {
        await invitation.delete();
        const userIndex = project.users.findIndex((x) =>
          x.user.equals(socket.user._id)
        );
        if (userIndex !== -1) {
          project.users[userIndex].permissions = 1;
          joinSuccess = true;
        }
      }
    };

    if (project && project.joinId.equals(joinId) && project.joinIdActive) {
      if (!invitation) {
        project.users.push({
          user: user._id,
          permissions: 1,
        });
        joinSuccess = true;
      }
      await handleInvitation();
    } else if (project && !joinId) {
      await handleInvitation();
    }
    if (joinSuccess) {
      user.projectsJoined.push(projectId);
      await project.save();
      await user.save();
      const updatedUser = await User.findOne({ _id: user._id })
        .select('-password')
        .populate('projectsCreated')
        .populate('projectsJoined');
      io.to(String(socket.user._id)).emit('user-updated', {
        ...updatedUser._doc,
        token: generateToken(updatedUser._id),
      });

      callback();
      if (invitation) {
        io.to(String(socket.user._id)).emit('notifications-updated');
      }
      const newProjectUsers = await Project.findById(projectId).populate({
        path: 'users.user',
        select: 'username email profilePicture',
      });
      io.to(data.projectId).emit(
        'project-users-updated',
        newProjectUsers.users
      );
    }
  });

  // @desc Update user permissions
  socket.on('project-user-permissions-update', async (data, callback) => {
    const { projectId, userId, newPermissions } = data;
    if (socket.user.permissions === 2) {
      const projectData = await Project.findOneAndUpdate(
        { _id: projectId, 'users.user': userId },
        {
          $set: {
            'users.$.permissions': newPermissions,
          },
        },
        { returnOriginal: false }
      ).populate({
        path: 'users.user',
        select: 'username email profilePicture',
      });
      callback();
      io.to(projectId).emit('user-permissions-changed', {
        userUpdated: {
          userId,
          newPermissions,
          projectId,
        },
      });
      io.to(projectId).emit('project-users-updated', projectData.users);
    }
  });

  // @desc Remove user from project
  socket.on('project-user-remove', async (data, callback) => {
    const { projectId, userId } = data;
    if (socket.user.permissions === 2 || socket.user._id.equals(userId)) {
      const projectData = await Project.findOneAndUpdate(
        { _id: projectId, 'users.user': userId },
        {
          $pull: {
            users: {
              user: userId,
            },
          },
        }
      ).populate({
        path: 'users.user',
        select: 'username email profilePicture',
      });
      callback();
      io.to(userId).emit('user-removed-from-project', projectId);
      io.to(projectId).emit('user-removed', {
        userUpdated: {
          userId,
          projectId,
        },
      });

      const userIndex = projectData.users.findIndex((u) =>
        u.user.equals(userId)
      );

      // remove user from assigned tasks and emit updated tasks
      if (
        userIndex !== -1 &&
        projectData.users[userIndex].tasksAssigned.length > 0
      ) {
        let updatedTasks = [];
        // delete remove user from task and store updated tasks in array
        const promise = projectData.users[
          userIndex
        ].tasksAssigned.map(async (taskId) =>
          updatedTasks.push(
            await taskPopulation(
              Task.findOneAndUpdate(
                { _id: taskId },
                { $pull: { users: userId } },
                { returnOriginal: false }
              )
            )
          )
        );

        Promise.all(promise).then(async () => {
          const newLists = await populateLists(projectId);
          io.to(projectId).emit('lists-update', { newLists });
          io.to(projectId).emit('tasks-updated', { tasks: updatedTasks });
        });
      }
      projectData.users.splice(userIndex, 1);
      io.to(projectId).emit('project-users-updated', projectData.users);
      await User.updateOne(
        { _id: userId },
        { $pull: { projectsJoined: projectId } }
      );

      // remove all notifications regarding this project and send notification about removal
      await Notification.deleteMany({ recipient: userId, project: projectId });
      if (!socket.user._id.equals(userId)) {
        const removeNotification = new Notification({
          type: 'Removed From Project',
          description: ` removed you from project: ${projectData.title}`,
          project: projectId,
          seenDate: null,
          sender: socket.user._id,
          recipient: userId,
        });
        await removeNotification.save();
      }
      io.to(userId).emit('notifications-updated');
    }
  });
};
