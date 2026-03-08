import { LayoutDashboard, RefreshCw } from "lucide-react";
export default function Header({ loadTasks, setShowForm }){
    return(
        <header className="bg-violet-600 p-5 flex justify-between items-center ">

            {/* left side */}
            <div className="flex items-center gap-3">
                <LayoutDashboard className="text-white" size={30} />
                <div  >
                    <h1 className="text-white text-2xl font-bold">Task Manager</h1>
                    <p className="text-violet-200 text-xs mt-0.5">Manage your workflow efficiently</p>
                </div>   
            </div>

            {/* right side */}
            <div className="flex items-center gap-3">

                <button 
                    onClick={loadTasks} 
                    className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg  "><RefreshCw size={16} /></button>
                <button 
                    onClick={() => setShowForm(true)}
                    className="bg-white text-violet-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-violet-50 transition"> +Add Task </button>

 

            </div> 

        </header>
    )
}