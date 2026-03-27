import { LayoutDashboard, RefreshCw, Plus } from "lucide-react";

export default function Header({ onRefresh, onAddTask }) {
  return (
    <header className="bg-violet-600 px-4 py-3 md:px-6 md:py-5">
      <div className="flex items-center justify-between">

        {/* Left Side */}
        <div className="flex items-center gap-2 md:gap-3">
          <LayoutDashboard className="text-white shrink-0" size={24} />
          <div>
            <h1 className="text-white text-lg md:text-2xl font-bold leading-tight">
              Task Manager
            </h1>
            <p className="text-violet-200 text-xs hidden sm:block mt-0.5">
              Manage your workflow efficiently
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={onAddTask}
            className="bg-white text-violet-700 font-semibold text-xs md:text-sm px-3 md:px-4 py-2 rounded-xl hover:bg-violet-50 transition flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

      </div>
    </header>
  );
}
