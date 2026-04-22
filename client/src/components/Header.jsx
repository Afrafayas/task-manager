import { useState, useRef, useEffect } from "react";
import { Plus, LogOut, Users, User, Settings, CheckSquare } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { toast } from "react-hot-toast";

export default function Header({ onAddTask, onToggleSidebar, activeWorkspace }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out!");
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-slate-100 px-4 md:px-6 py-3">
      <div className="flex items-center justify-between">

        {/* Left — Logo + Toggle */}
        <div className="flex items-center gap-3">
          {/* <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition"
            title="Workspaces"
          >
            <Users size={18} />
          </button> */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center">
              <CheckSquare size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-slate-800 text-base font-bold leading-tight tracking-tight">
                TaskFlow
              </h1>
              {/* <p className="text-slate-400 text-xs leading-none">
                {activeWorkspace ? activeWorkspace.name : "Personal workspace"}
              </p> */}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={onAddTask}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {/* Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-9 h-9 rounded-full bg-violet-600 text-white font-bold text-sm flex items-center justify-center hover:bg-violet-700 transition shadow-sm"
            >
              {user?.name?.charAt(0).toUpperCase()}
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-11 w-60 bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden z-50">
                {/* User Info */}
                <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu */}
                <div className="p-1.5">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition text-sm">
                    <User size={15} className="text-slate-400" />
                    Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition text-sm">
                    <Settings size={15} className="text-slate-400" />
                    Settings
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition text-sm font-medium"
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}