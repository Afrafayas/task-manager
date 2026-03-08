import { useState, useEffect } from "react";
const EMPTY ={ title: "", description: "", status: "Pending", priority: "Medium" };

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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div  className="bg-white w-full max-w-md rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">{initial ? "✏️ Edit Task" : "➕ New Task"}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">✕</button>
                </div>
                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
                    {/* Title */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-600">
                            Title <span className="text-red-500">*</span></label>
                        <input name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter task title..."
                            required
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition"/>
                    </div>
                    {/* Description */}
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

                    {/* Status + Priority */}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-600">Status</label>
                            <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition cursor-pointer"    >
                                <option>Pending</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                            </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                            <label >Priority</label>
                            <select name="priority" value={form.priority} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition cursor-pointer"    >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-end pt-2">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-linear-to-r from-violet-600 to-purple-600 text-white hover:opacity-90 transition
                        ">{
                            initial ? "Save Changes" : "Add Task"
                        }</button>
                    </div>
                    
                </form>    

            </div>
        </div>
    )
}   
