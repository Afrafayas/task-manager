import TaskCard from "./TaskCard";
import { Clock, Loader2, CheckCircle2 } from "lucide-react";

const COLUMNS = [
  {
    status: "Pending",
    label:  "Pending",
    icon:   <Clock size={15} />,
    border: "border-amber-400",
    badge:  "bg-amber-400",
    bg:     "bg-amber-50",
    text:   "text-amber-600",
  },
  {
    status: "In Progress",
    label:  "In Progress",
    icon:   <Loader2 size={15} />,
    border: "border-blue-500",
    badge:  "bg-blue-500",
    bg:     "bg-blue-50",
    text:   "text-blue-600",
  },
  {
    status: "Completed",
    label:  "Completed",
    icon:   <CheckCircle2 size={15} />,
    border: "border-emerald-500",
    badge:  "bg-emerald-500",
    bg:     "bg-emerald-50",
    text:   "text-emerald-600",
  },
];

export default function TaskBoard({ tasks, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        return (
          <div
            key={col.status}
            className={`${col.bg} rounded-2xl border-t-4 ${col.border} flex flex-col min-h-48 md:min-h-96 shadow-sm`}
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-black/5">
              <span className={col.text}>{col.icon}</span>
              <h2 className={`font-bold text-sm md:text-base ${col.text} flex-1`}>
                {col.label}
              </h2>
              <span className={`${col.badge} text-white text-xs font-bold px-2.5 py-0.5 rounded-full`}>
                {colTasks.length}
              </span>
            </div>

            {/* Column Body */}
            <div className="p-3 flex flex-col gap-3 flex-1">
              {colTasks.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm py-8">
                  No tasks here
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}


