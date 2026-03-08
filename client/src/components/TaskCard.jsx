
const PRIORITY = {
  Low:    "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  High:   "bg-red-100   text-red-700",
}
export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col gap-3">

      {/* Top Row — Badge + Buttons */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PRIORITY[task.priority] || PRIORITY["Medium"]}`}>
          {task.priority}
        </span>
        <div className="flex gap-1">
          <button onClick={() => onEdit(task)} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition">✏️</button>
          <button onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition">🗑️</button>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-800 text-sm leading-snug">{task.title}</h3>

      {/* Description */}
        {task.description && (
    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
        {task.description}
    </p>
    )}

      {/* Bottom Row — Status + Date */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 text-slate-600 cursor-pointer outline-none focus:border-violet-400 transition"
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <span className="text-xs text-slate-400">{new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
      </div>
    </div>
  )
}