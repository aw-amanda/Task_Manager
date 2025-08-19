import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import supabase from "@/sb-client-config"

export interface Task {
    id: number
    task_name: string
    task_description: string
    task_deadline: Date | null
    task_completed: boolean
}

export const TaskList = () => {
    const [taskList, setTaskList] = useState<Task[]>([])

    const { isPending, error } = useQuery({
        queryKey: ['taskData'],
        queryFn: async () => {
            const { data, error } = await supabase.from("Tasks").select("*")
            if (error) {
                console.log("Error fetching data: ", error)
                throw error
            }
            setTaskList(data as Task[])
            return data
        },
    })

    if (isPending) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center text-xl md:text-2xl
                            primary-gradient text-indigo-600">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                Loading
            </div>
        )
    }

    const completeTask = async (id: number, completedTask: boolean) => {
        const { error } = await supabase
            .from("Tasks")
            .update({ completedTask: !completedTask })
            .eq("id", id)

        if (error) {
            console.log("Error updating task: ", error)
        } else {
            const updatedTaskList = taskList.map(task => 
                task.id === id ? { ...task, completedTask: !completedTask } : task
            )
            setTaskList(updatedTaskList)
        }
    }

    if (error) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center primary-gradient">
                <div className="text-xl md:text-2xl text-indigo-600">There was an error loading tasks.</div>       
            </div>
        )
    }

    const deleteTask = async (id: number) => {
        const { error } = await supabase.from("Tasks").delete().eq("id", id)

        if (error) {
            console.log("Error deleting task: ", error)
        } else {
            setTaskList((prev) => prev.filter((task) => task.id !== id))
        }
    }

    return(
        <div 
            id="task-list"
            className="w-full min-h-screen px-10 py-20 flex flex-col items-center justify-center
                        primary-gradient"
        >
            <h1 className="text-5xl md:text-6xl font-display tracking-tighter text-transparent my-5 p-2
                        bg-clip-text bg-gradient-to-br from-indigo-800 to-indigo-400"
            >
                Current Tasks
            </h1>
            <div className="w-full p-1.5 bg-white/30 backdrop-blur-3xl border-1 border-white/60 rounded-xl">
                {taskList && taskList.length > 0 ? (
                    <ul className="w-full flex flex-col items-center gap-3 p-4">
                        {taskList.map((task) => (
                            <li 
                                key={task.id}
                                className="w-full bg-transparent border-1 border-white/60 p-2 rounded-xl space-y-2"
                            >
                                <div className="w-full flex flex-row justify-between">
                                    <p className="text-xl md:text-2xl text-shadow-lg bg-indigo-400/60 rounded-lg text-center px-4 py-2">{task.task_name}</p>
                                    <div className="space-x-3">
                                    <button 
                                            onClick={() => completeTask(task.id, task.task_completed)}
                                            className="p-2 bg-white/20 hover:bg-white/30 hover:-translate-y-1 transition-all duration-200 shadow-lg text-lg md:text-xl rounded-lg text-indigo-950"
                                        >
                                            {task.task_completed ? "undo ↺" : "complete ✔"}
                                        </button>
                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="p-2 bg-white/20 hover:bg-white/30 hover:-translate-y-1 transition-all duration-200 shadow-lg text-lg md:text-xl rounded-lg text-indigo-950"
                                        >
                                            delete ✖
                                        </button>  
                                    </div>
                                    
                                </div>
                                <p className="text-md md:text-lg bg-white/20 rounded-lg p-2">Details: <br />{task.task_description}</p>
                                <div className="w-full flex flex-row items-start space-x-3">
                                    <p className="text-md md:text-lg bg-indigo-400/40 rounded-lg p-2">Date: {task.task_deadline?.toString()}</p>
                                </div>
                            </li>
                        ))}
                    </ul>  
                ) : (
                    <div className="text-xl md:text-2xl text-center p-2">
                        There are no current tasks.
                    </div>
                )}
            </div>  
        </div>
    )
}
