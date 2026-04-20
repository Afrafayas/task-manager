const Workspace = require("../models/Workspace");
const User = require("../models/User");

// CREATE workspace
const createWorkspace = async (req, res) => {
  try {
    const workspace = new Workspace({
      name: req.body.name,
      owner: req.user.id,
      members: [{ user: req.user.id, role: "admin" }],
    });
    await workspace.save();

    // Populate before returning
    const populated = await Workspace.findById(workspace._id)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET my workspaces
const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user.id,
    })
      .populate("owner", "name email")
      .populate("members.user", "name email"); // ← ഇത് add ചെയ്യൂ!
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// INVITE member
const inviteMember = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMember = workspace.members.some(
      (m) => m.user.toString() === user._id.toString()
    );
    if (isMember)
      return res.status(400).json({ message: "User already a member" });

    workspace.members.push({ user: user._id, role: req.body.role || "member" });
    await workspace.save();

    // ← Populate ചെയ്ത് return ചെയ്യുന്നു
    const populated = await Workspace.findById(workspace._id)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    res.json({ message: "Member added successfully", workspace: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// REMOVE member
const removeMember = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    workspace.members = workspace.members.filter(
      (m) => m.user.toString() !== req.params.userId
    );
    await workspace.save();

    res.json({ message: "Member removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createWorkspace,
  getWorkspaces,
  inviteMember,
  removeMember,
};  