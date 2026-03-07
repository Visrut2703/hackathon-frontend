import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Interview from './components/Interview/Interview';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import Feedback from './components/Feedback/Feedback';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
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
    </Routes>
  );
}

export default App;