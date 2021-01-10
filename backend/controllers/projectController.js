import Project from '../models/project.js';
import List from '../models/list.js';
import Label from '../models/label.js';
import User from '../models/user.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import initialLabels from '../utils/labelsData.js';

// @desc    Create Project
// @route   POST /api/projects/
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { title, background } = req.body;
  const createdProject = new Project({
    title,
    creatorId: req.user._id,
    joinId: new mongoose.Types.ObjectId(),
    background: {
      color: background,
    },
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
        taskIds: [],
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'In Progress',
        taskIds: [],
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'To Review',
        taskIds: [],
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Finished',
        taskIds: [],
      },
    ],
    projectId: createdProject._id,
    archivedIds: [],
  });
  const labelsData = initialLabels.map((label) => {
    return { ...label, projectId: createdProject._id };
  });
  await Label.insertMany(labelsData);
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { projectsCreated: createdProject._id } }
  );
  await createdProject.save();
  await createdLists.save();
  res.status(201).json({ project: createdProject });
});

// @desc    Get Project Data
// @route   GET /api/projects/:projectId
// @access  Private
const getProjectData = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findOne({ _id: projectId }).populate({
    path: 'users.user',
    select: 'username email profilePicture',
  });
  const labels = await Label.find({ projectId });
  const lists = await List.findOne({ projectId });
  res.status(200).json({ project, labels, lists });
});

export { createProject, getProjectData };
