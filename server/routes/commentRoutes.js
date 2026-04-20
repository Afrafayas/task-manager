const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getComments,
  createComment,
  deleteComment,
  addReply,
  deleteReply,
} = require("../controllers/commentController");
const { authMiddleware } = require("../middleware/auth");

router.get("/", authMiddleware, getComments);
router.post("/", authMiddleware, createComment);
router.delete("/:id", authMiddleware, deleteComment);
router.post("/:commentId/replies", authMiddleware, addReply);
router.delete("/:commentId/replies/:replyId", authMiddleware, deleteReply);

module.exports = router;