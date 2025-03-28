import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Dashboard will handle the UI */}
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
