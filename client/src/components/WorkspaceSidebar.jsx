import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Users, ChevronRight, X, ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  loadWorkspaces,
  addWorkspace,
  inviteToWorkspace,
  setActiveWorkspace,
} from "../store/workspaceSlice";

export default function WorkspaceSidebar({ onClose }) {
  const dispatch = useDispatch();
  const { workspaces, activeWorkspace } = useSelector((state) => state.workspaces);
  const { user } = useSelector((state) => state.auth);

  const [collapsed, setCollapsed] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [wsName, setWsName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    dispatch(loadWorkspaces());
  }, [dispatch]);

  const handleCreate = async () => {
    if (!wsName.trim()) return;
    try {
      await dispatch(addWorkspace(wsName)).unwrap();
      toast.success("Workspace created!");
      setWsName("");
      setShowCreate(false);
    } catch (err) {
      toast.error(err);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !activeWorkspace) return;
    try {
      await dispatch(inviteToWorkspace({
        workspaceId: activeWorkspace._id,
        email: inviteEmail,
        role: "member",
      })).unwrap();
      toast.success("Member invited!");
      setInviteEmail("");
      setShowInvite(false);
    } catch (err) {
      toast.error(err);
    }
  };

  // Collapsed
  if (collapsed) {
    return (
      <div className="w-14 bg-white border-r border-slate-100 flex flex-col items-center py-3 gap-2 h-screen">
        <button
          onClick={() => setCollapsed(false)}
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition flex items-center justify-center"
        >
          <ChevronRight size={16} />
        </button>
        <div className="w-6 h-px bg-slate-100" />
        {workspaces.map((ws) => {
          const isActive = activeWorkspace?._id === ws._id;
          return (
            <button
              key={ws._id}
              onClick={() => { dispatch(setActiveWorkspace(ws)); setCollapsed(false); }}
              title={ws.name}
              className={`w-8 h-8 rounded-lg font-semibold text-xs flex items-center justify-center transition relative group ${
                isActive
                  ? "bg-violet-600 text-white ring-2 ring-offset-1 ring-violet-400"
                  : "bg-slate-100 text-slate-500 hover:bg-violet-100 hover:text-violet-600"
              }`}
            >
              {ws.name.charAt(0).toUpperCase()}
              <span className="absolute left-10 bg-slate-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                {ws.name}
              </span>
            </button>
          );
        })}
        <button
          onClick={() => setCollapsed(false)}
          className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-violet-50 hover:text-violet-600 transition relative group"
        >
          <Plus size={14} />
          <span className="absolute left-10 bg-slate-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
            New workspace
          </span>
        </button>
      </div>
    );
  }

  // Expanded
  return (
    <div className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen shadow-xl md:shadow-none">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
        <h2 className="font-bold text-slate-700 text-sm">Workspaces</h2>
        <div className="flex gap-1">
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition"
          >
            <Plus size={15} />
          </button>
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition hidden md:flex"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition md:hidden"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="px-4 py-3 border-b border-slate-100 flex flex-col gap-2 shrink-0">
          <input
            type="text"
            value={wsName}
            onChange={(e) => setWsName(e.target.value)}
            placeholder="Workspace name..."
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-violet-400 transition"
          />
          <button
            onClick={handleCreate}
            className="w-full bg-violet-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-violet-700 transition"
          >
            Create
          </button>
        </div>
      )}

      {/* Workspaces List */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5">
        {workspaces.map((ws) => (
          <button
            key={ws._id}
            onClick={() => dispatch(setActiveWorkspace(ws))}
            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2.5 transition ${
              activeWorkspace?._id === ws._id
                ? "bg-violet-50 text-violet-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
              activeWorkspace?._id === ws._id
                ? "bg-violet-600 text-white"
                : "bg-violet-100 text-violet-600"
            }`}>
              {ws.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium truncate flex-1">{ws.name}</span>
            <ChevronRight size={14} className="shrink-0 opacity-40" />
          </button>
        ))}
      </div>

      {/* Members */}
      {activeWorkspace && (
        <div className="border-t border-slate-100 p-4 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Users size={13} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500">Members</span>
            </div>
            {(activeWorkspace.owner?._id === user?.id || activeWorkspace.owner === user?.id) && (
              <button
                onClick={() => setShowInvite(!showInvite)}
                className="text-xs text-violet-600 font-medium hover:underline"
              >
                + Invite
              </button>
            )}
          </div>

          {showInvite && (
            <div className="flex flex-col gap-2 mb-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Email address..."
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-violet-400 transition"
              />
              <button
                onClick={handleInvite}
                className="w-full bg-violet-600 text-white text-xs font-semibold py-2 rounded-xl hover:bg-violet-700 transition"
              >
                Send Invite
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
            {activeWorkspace.members?.map((m) => (
              <div key={m._id} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 font-bold text-xs flex items-center justify-center shrink-0">
                  {m.user?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{m.user?.name || "Unknown"}</p>
                  <p className="text-xs text-slate-400">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}