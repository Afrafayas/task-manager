const express = require("express");
const router = express.Router();
const {
  createWorkspace,
  getWorkspaces,
  inviteMember,
  removeMember,
} = require("../controllers/workspaceController");
const { authMiddleware } = require("../middleware/auth");

// All routes protected
router.post("/", authMiddleware, createWorkspace);
router.get("/", authMiddleware, getWorkspaces);
router.post("/:id/invite", authMiddleware, inviteMember);
router.delete("/:id/members/:userId", authMiddleware, removeMember);

module.exports = router;