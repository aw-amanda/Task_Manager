import { useState } from "react"
import { type Task } from "./TaskList"
import supabase from "@/sb-client-config"
import { useQuery } from "@tanstack/react-query"
import Pin from "@/assets/push-pin.png"

interface CalendarProps {
  tasks: Task[]
  onTaskSelect: (task: Task) => void
  onDateSelect: (date: Date) => void
}

export const Calendar = ({ tasks, onTaskSelect, onDateSelect }: CalendarProps) => {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )

  const { data: taskData } = useQuery({
    queryKey: ['calendarTasks'],
    queryFn: async () => {
      const { data, error } = await supabase.from("Tasks").select("*")
      if (error) {
        console.log("Error fetching task data: ", error)
        throw error
      }
      return data as Task[]
    }
  })

  const allTasks = taskData || tasks

  const getTasksForDate = (date: Date) => {
    return allTasks.filter(task => {
      if (!task.task_deadline) return false
      const taskDate = new Date(task.task_deadline)
      return isSameDay(taskDate, date)
    })
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonthGrid = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysFromPrevMonth = firstDay.getDay()
    const daysFromNextMonth = 6 - lastDay.getDay()
    const totalDays = daysFromPrevMonth + lastDay.getDate() + daysFromNextMonth
    const days: Date[] = []
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i))
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    for (let i = 1; i <= daysFromNextMonth; i++) {
      days.push(new Date(year, month + 1, i))
    }
    while (days.length < 42) {
      const lastDate = days[days.length - 1]
      days.push(new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1))
    }

    return days
  }

  const daysOfMonth = getDaysInMonthGrid()

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    ))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    ))
  }

  const goToToday = () => {
    setCurrentMonth(new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    ))
    setSelectedDate(today)
    onDateSelect(today)
  }

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false
    return (
      date1.getUTCDate() === date2.getUTCDate() &&
      date1.getUTCMonth() === date2.getUTCMonth() &&
      date1.getUTCFullYear() === date2.getUTCFullYear()
    )
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth()
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateSelect(date)
  }

  const monthName = currentMonth.toLocaleString("default", { month: "long" })
  const year = currentMonth.getFullYear()

  return (
    <div 
      id="calendar"
      className="w-full min-h-[100vh] px-4 py-30 flex flex-col items-center primary-gradient">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-display tracking-tighter text-transparent mb-2 p-2
                       bg-clip-text bg-gradient-to-br from-indigo-800 to-indigo-400"
        >
          {monthName}, {year}
        </h1>

        <div className="flex gap-4 text-xl md:text-2xl text-black">
          <button 
            onClick={goToPreviousMonth}
            className="p-2 cursor-pointer hover:-translate-x-1 transition duration-200"
          >
              «
          </button>
          <button 
            onClick={goToToday}
            className="px-4 py-2 cursor-pointer hover:-translate-y-0.5 transition duration-200"
          >
            Today
          </button>
          <button 
            onClick={goToNextMonth}
            className="p-2 cursor-pointer hover:translate-x-1 transition duration-200"
          >
              »
          </button>
        </div>

        <div className="grid grid-cols-7 w-[37rem] gap-2 my-4 bg-white/20 rounded-xl backdrop-blur-lg">
          {weekdays.map((weekday, index) => (
            <div key={index} className="text-center text-lg md:text-xl py-1 px-2.5">
              {weekday}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 bg-white/30 backdrop-blur-lg rounded-xl py-4 px-2.5">
          {daysOfMonth.map((day, index) => {
            const dayTasks = getTasksForDate(day)
            return (
              <div 
                key={index}
                onClick={() => handleDateClick(day)}
                className="p-2 rounded-lg h-[80px] w-[75px] cursor-pointer hover:shadow-lg hover:shadow-white/50"
                style={{
                  background: 
                    isSameDay(selectedDate, day) 
                    ? 'linear-gradient(to bottom right, rgba(99, 100, 241, 0.5), rgba(53, 0, 247, 0.5))'
                    : isCurrentMonth(day) 
                    ? 'rgba(255, 255, 255, 0.5)' 
                    : 'rgba(255, 255, 255, 0.2)',
                  border: 
                    isSameDay(selectedDate, day)
                    ? '1px solid rgba(10, 0, 48, 0.6)'
                    : '1px solid rgba(255, 245, 255, 0.6)',
                  opacity: isCurrentMonth(day) ? 1 : 0.5
                }}
              >
                <div className="text-lg md:text-xl text-black">{day.getDate()}</div>
                {dayTasks.slice(0, 2).map(task => (
                  <div
                    key={task.id}
                    onClick={
                      (e) => {e.stopPropagation()
                      onTaskSelect(task)
                    }}
                    className="my-2 p-2 overflow-hidden rounded-lg whitespace-nowrap"
                  >
                    <img src={Pin} alt="Push pin indicating task" className="w-4 h-4" />
                  </div>
                ))}

                {dayTasks.length > 2 && (
                  <div className="text-md md:text-lg text-indigo-950">
                    +{dayTasks.length - 2 } more
                </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="w-[37rem] my-5 p-2 bg-white/30 backdrop-blur-lg border-1 border-white/60 rounded-xl">
        <div className="mb-10 text-lg">
          {!selectedDate ? "Select a day to view tasks..." : selectedDate.toLocaleString("en-US", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <div>
          {selectedDate && getTasksForDate(selectedDate).length === 0 && (
            <div>No tasks scheduled</div>
          )}
          {selectedDate && getTasksForDate(selectedDate).length > 0 && (
            <div className="flex flex-col gap-4">
              {getTasksForDate(selectedDate).map(task => (
                <div
                  key={task.id}
                  onClick={() => onTaskSelect(task)}
                  className="p-8 bg-white/40 rounded-lg border-1 border-gray-400 cursor-pointer"
                >
                  <div className="text-lg md:text-xl">{task.task_name}</div>
                  <div className="mt-2">{task.task_description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}