import { useState, useEffect, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import Header from "./components/Header";
import TaskBoard from "./components/TaskBoard";
import TaskForm from "./components/TaskForm";
import DeleteModal from "./components/DeleteModal";
import { fetchTasks, createTask, updateTask, deleteTask } from "./api/tasks";

export default function App() {

  const [tasks,       setTasks]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteId,    setDeleteId]    = useState(null);

  const openDelete = (id) => setDeleteId(id);

  // ── Fetch all tasks ──
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  // ── Add or Edit task ──
  const handleSubmit = async (form) => {
    try {
      if (editingTask) {
        const data = await updateTask(editingTask._id, form);
        setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
        toast.success("Task updated!");
      } else {
        const data = await createTask(form);
        setTasks((prev) => [data, ...prev]);
        toast.success("Task created!");
      }
      closeForm();
    } catch {
      toast.error("Something went wrong");
    }
  };

  // ── Delete task ──
  const handleDelete = async () => {
    try {
      await deleteTask(deleteId);
      setTasks((prev) => prev.filter((t) => t._id !== deleteId));
      toast.success("Task deleted!");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete task");
    }
  };

  // ── Change task status ──
  const handleStatusChange = async (id, status) => {
    try {
      const data = await updateTask(id, { status });
      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
      toast.success(`Moved to ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const openEdit  = (task) => { setEditingTask(task); setShowForm(true); };
  const closeForm = ()     => { setEditingTask(null); setShowForm(false); };

  return (
    <div className="min-h-screen bg-slate-100">
      <Toaster position="top-right" />

      {/* ── Header ── */}
      <Header loadTasks={loadTasks} setShowForm={setShowForm} />

      {/* ── Stats ── */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Tasks",  value: tasks.length,                                         color: "border-violet-500 text-violet-600"  },
            { label: "Pending",      value: tasks.filter(t => t.status === "Pending").length,     color: "border-amber-400  text-amber-500"   },
            { label: "In Progress",  value: tasks.filter(t => t.status === "In Progress").length, color: "border-blue-500   text-blue-600"    },
            { label: "Completed",    value: tasks.filter(t => t.status === "Completed").length,   color: "border-emerald-500 text-emerald-600" },
          ].map((s) => (
            <div key={s.label} className={`bg-white rounded-2xl p-4 flex flex-col items-center shadow-sm border-t-4 ${s.color}`}>
              <span className={`text-2xl font-bold ${s.color.split(" ")[1]}`}>{s.value}</span>
              <span className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wide">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Board ── */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="text-center text-slate-400 py-20">
            Loading tasks...
          </div>
        ) : (
          <TaskBoard
            tasks={tasks}
            onEdit={openEdit}
            onDelete={openDelete}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      {/* ── Add/Edit Modal ── */}
      {showForm && (
        <TaskForm
          onSubmit={handleSubmit}
          onClose={closeForm}
          initial={editingTask}
        />
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

    </div>
  );
} 