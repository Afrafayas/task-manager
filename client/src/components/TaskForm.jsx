import { useState, useEffect } from "react";
import { X } from "lucide-react";

const EMPTY = { title: "", description: "", status: "Pending", priority: "Medium" };

export default function TaskForm({ onSubmit, onClose, initial }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (initial) setForm(initial);
    else setForm(EMPTY);
  }, [initial]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
    {/*                                                                    ↑                   ↑
                                                                  mobile: bottom       desktop: center */}
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
      {/*                        ↑                  ↑                    ↑
                          full width          max width           scrollable if
                          on mobile           on desktop          content too tall */}

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
        {/*                                                                             ↑
                                                                              stays visible when scrolling */}
          <h2 className="text-base md:text-lg font-bold text-slate-800">
            {initial ? "✏️ Edit Task" : "➕ New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-600">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter task title..."
              required
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-600">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description..."
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-600">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-violet-500 outline-none transition cursor-pointer"
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-600">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-violet-500 outline-none transition cursor-pointer"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:opacity-90 transition"
            >
              {initial ? "Save Changes" : "Add Task"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}


