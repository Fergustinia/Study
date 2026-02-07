import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { ProjectProvider } from './context/ProjectContext';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Sprints from './pages/Sprints';
import Board from './pages/Board';
import Metrics from './pages/Metrics';
import Login from './pages/Login';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <ProjectProvider>
              <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/sprints" element={<Sprints />} />
                <Route path="/board" element={<Board />} />
                <Route path="/metrics" element={<Metrics />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
            </ProjectProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
