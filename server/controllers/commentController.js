const Comment = require("../models/Comment");
const Task = require("../models/Task");
const Workspace = require("../models/Workspace");


const isWorkspaceMember = async (workspaceId, userId) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    "members.user": userId,
  });
  return !!workspace;
};

// GET all comments for a task
const getComments = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const hasAccess = task.user.toString() === req.user.id ||
      (task.workspace && await isWorkspaceMember(task.workspace, req.user.id));

    if (!hasAccess) return res.status(403).json({ message: "Access denied" });

    const comments = await Comment.find({ task: req.params.taskId })
      .populate("user", "name email")
      .populate("replies.user", "name email") // ← ഇത് add ചെയ്യൂ!
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE comment
const createComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check access — task owner or workspace member
    const hasAccess = task.user.toString() === req.user.id ||
      (task.workspace && await isWorkspaceMember(task.workspace, req.user.id));
    
    if (!hasAccess) return res.status(403).json({ message: "Access denied" });

    const comment = new Comment({
      text: req.body.text,
      task: req.params.taskId,
      user: req.user.id,
      workspace: task.workspace || null,
    });
    const saved = await comment.save();
    const populated = await saved.populate("user", "name email");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ADD reply
const addReply = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies.push({
      text: req.body.text,
      user: req.user.id,
    });
    await comment.save();

    const populated = await Comment.findById(comment._id)
      .populate("user", "name email")
      .populate("replies.user", "name email");

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE reply
const deleteReply = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies = comment.replies.filter(
      (r) => r._id.toString() !== req.params.replyId
    );
    await comment.save();

    res.json({ message: "Reply deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getComments, createComment, deleteComment, addReply, deleteReply };