export const getTaskIndexes = (
  lists,
  taskIndex,
  listIndex,
  taskId,
  callback
) => {
  if (
    lists[listIndex] &&
    lists[listIndex].tasks[taskIndex] &&
    lists[listIndex].tasks[taskIndex]._id === taskId
  ) {
    callback(listIndex, taskIndex);
  } else {
    // very rare case in which task or list index would change between updating labels
    let taskIndex;
    const listIndex = lists.findIndex((list) => {
      const innerTaskIndex = list.tasks.findIndex(
        (task) => task._id === taskId
      );
      if (innerTaskIndex > -1) {
        taskIndex = innerTaskIndex;
        return true;
      } else return false;
    });
    if (listIndex > -1 && taskIndex > -1) callback(listIndex, taskIndex);
  }
};
