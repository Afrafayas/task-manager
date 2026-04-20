const Task = require("../models/Task");
const Workspace = require("../models/Workspace");

// Helper — check workspace member
const isWorkspaceMember = async (workspaceId, userId) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    "members.user": userId,
  });
  return !!workspace;
};

// GET all tasks
const getAllTasks = async (req, res) => {
  try {
    const { workspaceId } = req.query;

    let query;
    if (workspaceId) {
      // Check member
      const isMember = await isWorkspaceMember(workspaceId, req.user.id);
      if (!isMember)
        return res.status(403).json({ message: "Not a workspace member" });
      query = { workspace: workspaceId };
    } else {
      query = { user: req.user.id, workspace: null };
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE task
const createTask = async (req, res) => {
  try {
    const { workspaceId, assignedTo, ...rest } = req.body;

    if (workspaceId) {
      const isMember = await isWorkspaceMember(workspaceId, req.user.id);
      if (!isMember)
        return res.status(403).json({ message: "Not a workspace member" });
    }

    const task = new Task({
      ...rest,
      user: req.user.id,
      workspace: workspaceId || null,
      assignedTo: assignedTo || null,
    });
    const saved = await task.save();
    const populated = await saved.populate("assignedTo", "name email");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [
        { user: req.user.id },
        { assignedTo: req.user.id },
      ],
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("assignedTo", "name email");
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask };