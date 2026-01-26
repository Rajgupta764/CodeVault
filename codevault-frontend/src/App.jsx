import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import AddProblem from './pages/AddProblem'
import ProblemDetail from './pages/ProblemDetail'
import AddSolution from './pages/AddSolution'
import Revisions from './pages/Revisions'
import Collections from './pages/Collections'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-problem"
          element={
            <ProtectedRoute>
              <AddProblem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problem/:id"
          element={
            <ProtectedRoute>
              <ProblemDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-solution/:id"
          element={
            <ProtectedRoute>
              <AddSolution />
            </ProtectedRoute>
          }
        />
        <Route
          path="/revisions"
          element={
            <ProtectedRoute>
              <Revisions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collections"
          element={
            <ProtectedRoute>
              <Collections />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collections/:id"
          element={
            <ProtectedRoute>
              <Collections />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}