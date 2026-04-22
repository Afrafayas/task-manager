  import { useEffect, useState } from "react";
  import { Routes, Route, Navigate } from "react-router-dom";
  import { useDispatch, useSelector } from "react-redux";
  import { Toaster, toast } from "react-hot-toast";
  import Header from "./components/Header";
  import TaskBoard from "./components/TaskBoard";
  import TaskForm from "./components/TaskForm";
  import DeleteModal from "./components/DeleteModal";
  import WorkspaceSidebar from "./components/WorkspaceSidebar";
  import Login from "./pages/Login";
  import Register from "./pages/Register";
  import WorkspaceBar from "./components/WorkspaceBar";
  import { loadWorkspaces } from "./store/workspaceSlice";

  import {
    loadTasks, addTask, editTask, removeTask,
    openForm, closeForm, setEditing, setDeleteId, clearDelete,
  } from "./store/tasksSlice";

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" />;
  };

  function Dashboard() {
    const dispatch = useDispatch();
    const { tasks, loading, showForm, editingTask, deleteId } = useSelector(
      (state) => state.tasks
    );
    const { activeWorkspace } = useSelector((state) => state.workspaces);
    const [showSidebar, setShowSidebar] = useState(true);

      useEffect(() => {
      dispatch(loadWorkspaces());
    }, [dispatch]);


    useEffect(() => {
      if (activeWorkspace) {
        dispatch(loadTasks({ workspaceId: activeWorkspace._id }));
      } else {
        dispatch(loadTasks({}));
      }
    }, [dispatch, activeWorkspace]);

    const handleSubmit = async (form) => {
      try {
        if (editingTask) {
          await dispatch(editTask({ id: editingTask._id, taskData: form })).unwrap();
          toast.success("Task updated!");
        } else {
          const taskData = activeWorkspace
            ? { ...form, workspaceId: activeWorkspace._id }
            : form;
          await dispatch(addTask(taskData)).unwrap();
          toast.success("Task created!");
        }
      } catch {
        toast.error("Something went wrong");
      }
    };

    const handleDelete = async () => {
      try {
        await dispatch(removeTask(deleteId)).unwrap();
        toast.success("Task deleted!");
      } catch {
        toast.error("Failed to delete task");
      }
    };

    const handleStatusChange = async (id, status) => {
      try {
        await dispatch(editTask({ id, taskData: { status } })).unwrap();
        toast.success(`Moved to ${status}`);
      } catch {
        toast.error("Failed to update status");
      }
    };

    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <Header
          // onRefresh={() => activeWorkspace
          //   ? dispatch(loadTasks({ workspaceId: activeWorkspace._id }))
          //   : dispatch(loadTasks({}))}
          onAddTask={() => dispatch(openForm())}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          activeWorkspace={activeWorkspace}
        />
        <WorkspaceBar activeWorkspace={activeWorkspace} />

        <div className="flex flex-1 overflow-hidden h-full">
          {/* Sidebar */}
          {showSidebar && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/40 z-30 md:hidden"
                onClick={() => setShowSidebar(false)}
              />
              {/* Sidebar */}
              <div className="fixed top-0 left-0 h-screen z-40 md:relative md:h-full md:z-auto">
                <WorkspaceSidebar onClose={() => setShowSidebar(false)} />
              </div>
            </>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 md:pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                {[
                  { label: "Total", value: tasks.length, color: "border-violet-500 text-violet-600" },
                  { label: "Pending", value: tasks.filter(t => t.status === "Pending").length, color: "border-amber-400 text-amber-500" },
                  { label: "In Progress", value: tasks.filter(t => t.status === "In Progress").length, color: "border-blue-500 text-blue-600" },
                  { label: "Completed", value: tasks.filter(t => t.status === "Completed").length, color: "border-emerald-500 text-emerald-600" },
                ].map((s) => (
                  <div key={s.label} className={`bg-white rounded-2xl p-3 md:p-4 flex flex-col items-center shadow-sm border-t-4 ${s.color}`}>
                    <span className={`text-2xl md:text-3xl font-bold ${s.color.split(" ")[1]}`}>{s.value}</span>
                    <span className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wide text-center">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-6">
              {loading ? (
                <div className="text-center text-slate-400 py-20">Loading tasks...</div>
              ) : (
                <TaskBoard
                  tasks={tasks}
                  onEdit={(task) => dispatch(setEditing(task))}
                  onDelete={(id) => dispatch(setDeleteId(id))}
                  onStatusChange={handleStatusChange}
                />
              )}
            </main>
          </div>
        </div>

        {showForm && (
          <TaskForm
            onSubmit={handleSubmit}
            onClose={() => dispatch(closeForm())}
            initial={editingTask}
          />
        )}

        {deleteId && (
          <DeleteModal
            onConfirm={handleDelete}
            onCancel={() => dispatch(clearDelete())}
          />
        )}
      </div>
    );
  }

  export default function App() {
    return (
      <>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </>
    );
  }