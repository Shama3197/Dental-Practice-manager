import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import AppLayout from './AppLayout';
import CommunicationsPanel from './Sidebar/CommunicationsPanel';

// Import page components
// import Dashboard from './Dashboard/Dashboard';
import DashboardPage from '../pages/DashboardPage';
import Patients from '../pages/Patients';
import Appointments from '../pages/Appointments';
import Reports from '../pages/Reports';
import PatientProfile from './Patients/PatientProfile';
import Earnings from '../pages/Earnings';
import Labwork from '../pages/Labwork';
import Treatments from '../pages/Treatments';
import Settings from '../pages/Settings';
import Calendar from '../pages/Calendar';

const Routes = () => {
  return (
    <RouterRoutes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Main app routes with AppLayout wrapper */}
      <Route path="/dashboard" element={
        <AppLayout>
          <DashboardPage />
        </AppLayout>
      } />
      
      <Route path="/patients" element={
        <AppLayout>
          <Patients />
        </AppLayout>
      } />
      
      <Route path="/patients/:id" element={
        <AppLayout>
          <PatientProfile />
        </AppLayout>
      } />
      
      <Route path="/appointments" element={
        <AppLayout>
          <Appointments />
        </AppLayout>
      } />
      
      <Route path="/treatments" element={
        <AppLayout>
          <Treatments />
        </AppLayout>
      } />
      
      <Route path="/labwork" element={
        <AppLayout>
          <Labwork />
        </AppLayout>
      } />
      
      <Route path="/earnings" element={
        <AppLayout>
          <Earnings />
        </AppLayout>
      } />
      
      <Route path="/reports" element={
        <AppLayout>
          <Reports />
        </AppLayout>
      } />
      
      <Route path="/settings" element={
        <AppLayout>
          <Settings />
        </AppLayout>
      } />
      
      <Route path="/calendar" element={
        <AppLayout>
          <Calendar />
        </AppLayout>
      } />
      
      <Route path="/communications" element={
        <AppLayout>
          <CommunicationsPanel />
        </AppLayout>
      } />
      
      {/* Catch all route - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </RouterRoutes>
  );
};

export default Routes; 