import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { StudyProvider } from './context/StudyContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Tasks from './pages/Tasks';
import Revision from './pages/Revision';
import AITools from './pages/AITools';

function App() {
  return (
    <ThemeProvider>
      <StudyProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/revision" element={<Revision />} />
              <Route path="/ai-tools" element={<AITools />} />
            </Routes>
          </Layout>
          <ToastContainer 
            position="bottom-right"
            theme="dark"
            toastStyle={{ backgroundColor: 'rgba(20, 20, 25, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          />
        </Router>
      </StudyProvider>
    </ThemeProvider>
  );
}

export default App;
