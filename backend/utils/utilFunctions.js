import List from '../models/list.js';

export const populateLists = async (projectId) => {
  const newLists = await List.findOne({ projectId })
    .populate({
      path: 'lists.tasks',
      populate: {
        path: 'users',
        select: 'username email profilePicture',
      },
    })
    .populate({
      path: 'lists.tasks',
      populate: { path: 'labels' },
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
      populate: { path: 'labels' },
    });

  return newLists;
};
