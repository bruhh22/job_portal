import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import AdminJobs from './pages/Admin/AdminJobs.jsx';
import JobForm from './pages/Admin/JobForm.jsx';
import Jobs from './pages/User/Jobs.jsx';
import JobDetails from './pages/User/JobDetails.jsx';
import MyApplications from './pages/User/MyApplications.jsx';
import MyFavourites from './pages/User/MyFavourites.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/jobs" replace />} />

              {/* Candidate Routes (Shared with Admin for viewing) */}
              <Route element={<ProtectedRoute allowedRoles={['candidate', 'admin']} />}>
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
              </Route>

              {/* Candidate Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
                <Route path="/my-applications" element={<MyApplications />} />
                <Route path="/my-favourites" element={<MyFavourites />} />
              </Route>

              {/* Admin Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/jobs" element={<AdminJobs />} />
                <Route path="/admin/jobs/create" element={<JobForm />} />
                <Route path="/admin/jobs/edit/:id" element={<JobForm />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-gray-600 text-lg">Page Not Found</p>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;