import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import WeeklySchedule from './pages/WeeklySchedule'
import ExamSchedule from './pages/ExamSchedule'
import MemoryReview from './pages/MemoryReview'
import StudyPlan from './pages/StudyPlan'
import Quotes from './pages/Quotes'
import Quiz from './pages/Quiz'
import Weights from './pages/Weights'
import MoodSchedule from './pages/MoodSchedule'
import Overdue from './pages/Overdue'
import ExportPdf from './pages/ExportPdf'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="schedule" element={<WeeklySchedule />} />
            <Route path="exam" element={<ExamSchedule />} />
            <Route path="memory" element={<MemoryReview />} />
            <Route path="study-plan" element={<StudyPlan />} />
            <Route path="quotes" element={<Quotes />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="weights" element={<Weights />} />
            <Route path="mood-schedule" element={<MoodSchedule />} />
            <Route path="overdue" element={<Overdue />} />
            <Route path="export" element={<ExportPdf />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
