export default function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl">

        {/* Icon */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-red-500 w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          {/* Text */}
          <h2 className="text-lg font-bold text-slate-800 mb-1">Delete Task?</h2>
          <p className="text-sm text-slate-500 text-center">
            This action cannot be undone. The task will be permanently removed.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 px-6 pb-6 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition"
          >
            Yes, Delete
          </button>
        </div>

      </div>
    </div>
  );
}