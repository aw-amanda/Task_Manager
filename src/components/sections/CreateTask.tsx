import { useState } from "react"
import supabase from "@/sb-client-config"

export const CreateTask = () => {
    const [taskList, setTaskList] = useState([])
    const [newTask, setNewTask] = useState("")
    const [newDescription, setNewDescription] = useState("")
    const [newDeadline, setNewDeadline] = useState("")
    
    const addTask = async (e: React.FormEvent) => {
        e.preventDefault()
        const newTaskData = {
            task_name: newTask,
            task_description: newDescription,
            task_deadline: newDeadline,
            task_completed: false,
        }
        const { data, error } = await supabase.from("Tasks").insert([newTaskData]).single()

        if (error) {
            console.log("Error adding task: ", error)
            alert("Task could not be added, please try again.")
        } else {
            setTaskList((prev) => [...prev, data])
            setNewTask("")
            setNewDescription("")
            setNewDeadline("")
            alert("Task added successfully!")
        }
    }

    return (
        <div 
            id="create-task"
            className="w-screen min-h-[100vh] px-5 flex flex-col items-center justify-center primary-gradient"
        >
            <h1 className="text-5xl md:text-6xl font-display tracking-tighter text-transparent mb-2 p-2
                            bg-clip-text bg-gradient-to-br from-indigo-800 to-indigo-400"
            >
                New Task
            </h1>
            <div className="w-3/4 max-w-2xl p-2 bg-white/20 backdrop-blur-3xl border-1 border-white/30 
                            rounded-3xl overflow-hidden"
            >
                <form onSubmit={addTask} className="flex flex-col items-start space-y-5 px-2 py-4">
                    <input 
                        onChange={(e) => setNewTask(e.target.value)}
                        value={newTask}
                        type="text" 
                        placeholder="Title..." 
                        required 
                        className="w-full bg-white/10 text-xl md:text-2xl border-1 border-white/40 
                                    rounded-lg p-2 focus:outline-none focus:bg-white/20"
                    />
                    <textarea 
                        onChange={(e) => setNewDescription(e.target.value)}
                        value={newDescription}
                        placeholder="Description..." 
                        rows={5} 
                        cols={10} 
                        className="w-full max-h-3/5 bg-white/10 text-lg md:text-xl border-1 border-white/40 
                                    rounded-lg p-2 focus:outline-none focus:bg-white/20"
                    />
                    <label className="text-2xl md:3xl text-shadow-md">Date:</label>
                    <input 
                        onChange={(e) => setNewDeadline(e.target.value)}
                        value={newDeadline}
                        type="date"
                        className="w-full py-2 text-lg md:text-xl bg-white/10 rounded-lg focus:outline-none"
                     />
                    <button 
                        type="submit"
                        className="mt-5 px-2 py-1 self-center bg-white/20 border-1 border-white/40 rounded-xl
                                   hover:bg-white/30 hover:-translate-y-1 transition-all duration-200 text-xl 
                                   md:text-2xl"
                    >
                        Add Task
                    </button>
                </form>
            </div>
        </div>
    )
}
