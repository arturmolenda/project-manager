import Project from '../models/project.js';

export const socketProjectController = (io, socket) => {
  socket.on('project-title-update', async (data, callback) => {
    const { title, projectId } = data;
    callback();
    socket.to(projectId).emit('project-title-updated', { title, projectId });
    await Project.updateOne({ _id: projectId }, { $set: { title: title } });
  });
};
