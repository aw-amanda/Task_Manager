import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navbar } from './components/ui/navbar'
import './index.css'
import { CreateTask } from './components/sections/CreateTask'
import { TaskList, type Task } from './components/sections/TaskList'
import { Calendar } from './components/sections/Calendar'

export type Page = 'home' | 'create' | 'list' | 'calendar'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  

  const renderPage = () => {
    switch (currentPage) {
      case 'create':
        return <CreateTask />
      case 'list':
        return <TaskList />
      case 'calendar':
        return (
          <Calendar 
            tasks={tasks}
            onTaskSelect={(task) => {setSelectedTask(task)}}
            onDateSelect={(date) => {setSelectedDate(date)}}
          />
        )
      default:
        return <Calendar 
            tasks={tasks}
            onTaskSelect={(task) => {setSelectedTask(task)}}
            onDateSelect={(date) => {setSelectedDate(date)}}
          />
    }
  }

  return (
    <QueryClientProvider client={new QueryClient()}>
      <div className="app-container">
        <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
        <main className="page-content">
          {renderPage()}
        </main>
      </div>
    </QueryClientProvider>
  )
}

export default App