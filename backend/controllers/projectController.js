import Project from '../models/project.js';
import List from '../models/list.js';
import Label from '../models/label.js';
import Task from '../models/task.js';
import User from '../models/user.js';
import Message from '../models/message.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import initialLabels from '../utils/labelsData.js';
import { populateLists, taskPopulation } from '../utils/utilFunctions.js';

// @desc    Create Project
// @route   POST /api/projects/
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { title, background } = req.body;
  const createdProject = new Project({
    title,
    creatorId: req.user._id,
    joinId: new mongoose.Types.ObjectId(),
    users: [
      {
        user: req.user._id,
        permissions: 2,
      },
    ],
  });
  const createdLists = new List({
    lists: [
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'To Do',
        tasks: [],
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'In Progress',
        tasks: [],
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'To Review',
        tasks: [],
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Finished',
        tasks: [],
      },
    ],
    projectId: createdProject._id,
    archivedTasks: [],
  });

  const labelIds = [];
  const labelsData = initialLabels.reduce((acc, label) => {
    const labelId = new mongoose.Types.ObjectId();
    label._id = labelId;
    labelIds.push(labelId);
    acc[labelId] = label;
    return acc;
  }, {});

  await Label.create({
    labels: labelsData,
    labelIds: labelIds,
    projectId: createdProject._id,
  });
  await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $push: { projectsCreated: createdProject._id },
      $set: {
        [`projectsThemes.${createdProject._id}`]: {
          background,
          mainColor: '#00bcd4',
        },
      },
    }
  );
  await createdProject.save();
  await createdLists.save();
  res.status(201).json({ project: createdProject });
});

// @desc    Get Project Data
// @route   GET /api/projects/:projectId
// @access  Private, Project Permissions 1
const getProjectData = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findOne({ _id: projectId }).populate({
    path: 'users.user',
    select: 'username email profilePicture',
  });
  const labels = await Label.findOne({ projectId });
  const lists = await populateLists(projectId);
  const messages = await Message.find({ projectId }).populate({
    path: 'user',
    select: 'username profilePicture',
  });

  const userPermissions = project.users.find((user) =>
    req.user._id.equals(user.user._id)
  );

  res.status(200).json({
    project: { ...project._doc, permissions: userPermissions.permissions },
    labels,
    lists,
    messages,
  });
});

// @desc    Get Task by taskId
// @route   GET /api/projects/getTask/:projectId/:taskId
// @access  Private, Project Permissions 1
const getTask = asyncHandler(async (req, res) => {
  const { taskId, projectId } = req.params;
  const task = await taskPopulation(Task.findOne({ _id: taskId, projectId }));

  if (task) res.status(200).json(task);
  else {
    res.status(404);
    throw new Error('Task not found');
  }
});

export { createProject, getProjectData, getTask };
