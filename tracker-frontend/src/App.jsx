import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Routes from './components/Routes';

function App() {
  return (
    <div className="min-h-screen">
      <Routes />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App; 