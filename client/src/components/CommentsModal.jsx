import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Trash2, Send, Reply, ChevronDown, ChevronUp } from "lucide-react";
import {
  loadComments,
  addComment,
  removeComment,
  addReplyToComment,
  removeReply,
  clearComments,
} from "../store/commentsSlice";
import { toast } from "react-hot-toast";

export default function CommentsModal({ task, onClose }) {
  const dispatch = useDispatch();
  const { comments, loading } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReply, setShowReply] = useState({});
  const [showReplies, setShowReplies] = useState({});

  useEffect(() => {
    dispatch(loadComments(task._id));
    return () => dispatch(clearComments());
  }, [dispatch, task._id]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    try {
      await dispatch(addComment({ taskId: task._id, text })).unwrap();
      setText("");
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await dispatch(removeComment({ taskId: task._id, commentId })).unwrap();
      toast.success("Comment deleted!");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText[commentId]?.trim()) return;
    try {
      await dispatch(addReplyToComment({
        taskId: task._id,
        commentId,
        text: replyText[commentId],
      })).unwrap();
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setShowReply((prev) => ({ ...prev, [commentId]: false }));
      setShowReplies((prev) => ({ ...prev, [commentId]: true }));
      toast.success("Reply added!");
    } catch {
      toast.error("Failed to add reply");
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      await dispatch(removeReply({ taskId: task._id, commentId, replyId })).unwrap();
      toast.success("Reply deleted!");
    } catch {
      toast.error("Failed to delete reply");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-800">Comments</h2>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
            <X size={18} />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {loading ? (
            <div className="text-center text-slate-400 py-8">Loading...</div>
          ) : comments.length === 0 ? (
            <div className="text-center text-slate-400 py-8">No comments yet</div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="bg-slate-50 rounded-xl p-3 flex flex-col gap-2">
                {/* Comment */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 font-bold text-sm flex items-center justify-center shrink-0">
                    {comment.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-700">{comment.user?.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">
                          {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        <button
                          onClick={() => setShowReply((prev) => ({ ...prev, [comment._id]: !prev[comment._id] }))}
                          className="text-slate-300 hover:text-violet-500 transition"
                        >
                          <Reply size={13} />
                        </button>
                        {comment.user?._id === user?.id && (
                          <button onClick={() => handleDelete(comment._id)} className="text-slate-300 hover:text-red-500 transition">
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{comment.text}</p>
                  </div>
                </div>

                {/* Reply Input */}
                {showReply[comment._id] && (
                  <div className="flex gap-2 ml-11">
                    <input
                      type="text"
                      value={replyText[comment._id] || ""}
                      onChange={(e) => setReplyText((prev) => ({ ...prev, [comment._id]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleReply(comment._id)}
                      placeholder="Write a reply..."
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-violet-400 transition"
                    />
                    <button
                      onClick={() => handleReply(comment._id)}
                      className="bg-violet-600 hover:bg-violet-700 text-white p-1.5 rounded-xl transition"
                    >
                      <Send size={12} />
                    </button>
                  </div>
                )}

                {/* Replies */}
                {comment.replies?.length > 0 && (
                  <div className="ml-11">
                    <button
                      onClick={() => setShowReplies((prev) => ({ ...prev, [comment._id]: !prev[comment._id] }))}
                      className="text-xs text-violet-600 font-medium flex items-center gap-1 mb-2"
                    >
                      {showReplies[comment._id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                    </button>

                    {showReplies[comment._id] && (
                      <div className="flex flex-col gap-2">
                        {comment.replies.map((reply) => (
                          <div key={reply._id} className="flex gap-2 bg-white rounded-lg p-2">
                            <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 font-bold text-xs flex items-center justify-center shrink-0">
                              {reply.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-700">{reply.user?.name}</span>
                                {reply.user?._id === user?.id && (
                                  <button
                                    onClick={() => handleDeleteReply(comment._id, reply._id)}
                                    className="text-slate-300 hover:text-red-500 transition"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5">{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Write a comment..."
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-violet-400 transition"
          />
          <button onClick={handleSubmit} className="bg-violet-600 hover:bg-violet-700 text-white p-2.5 rounded-xl transition">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}