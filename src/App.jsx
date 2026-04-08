import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Interview from './components/Interview/Interview';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import Feedback from './components/Feedback/Feedback';
import AdminDashboard from './components/Admin/AdminDashboard';
import Reports from './components/Admin/Reports';

const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (roleRequired && userRole !== roleRequired) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />}/> 
      <Route path="/signup" element={<Signup />}/> 
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }/> 
      
      <Route path="/admin" element={
        <ProtectedRoute roleRequired="admin">
          <AdminDashboard />
        </ProtectedRoute>
      }/>

      <Route path="/admin/reports" element={
        <ProtectedRoute roleRequired="admin">
          <Reports />
        </ProtectedRoute>
      }/>
      
      <Route path="/interview/:id" element={
        <ProtectedRoute>
          <Interview />
        </ProtectedRoute>
      }/> 
      
      <Route path="/feedback" element={
        <ProtectedRoute>
          <Feedback />
        </ProtectedRoute>
      }/>

      {/* Catch-all route for undefined paths like /interview without ID */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;