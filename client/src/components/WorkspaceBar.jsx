import { Users, ChevronRight, LayoutGrid } from "lucide-react";

export default function WorkspaceBar({ activeWorkspace }) {
  if (!activeWorkspace) return null;

  return (
    <div className="bg-white border-b border-slate-100 px-4 md:px-6 py-2 flex items-center justify-between">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <LayoutGrid size={14} className="text-violet-500" />
        <span className="text-violet-600 font-medium">{activeWorkspace.name}</span>
        <ChevronRight size={14} />
        <span className="text-slate-400">Tasks</span>
      </div>

      {/* Members Avatars */}
      <div className="flex items-center gap-2">
        <Users size={13} className="text-slate-400" />
        <div className="flex -space-x-2">
          {activeWorkspace.members?.slice(0, 4).map((m) => (
            <div
              key={m._id}
              title={m.user?.name}
              className="w-7 h-7 rounded-full bg-violet-100 text-violet-600 font-bold text-xs flex items-center justify-center border-2 border-white"
            >
              {m.user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
          ))}
          {activeWorkspace.members?.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center border-2 border-white">
              +{activeWorkspace.members.length - 4}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}