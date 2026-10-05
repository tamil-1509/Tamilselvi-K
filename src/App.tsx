import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AuthView } from './components/auth/AuthView';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { DoctorDashboard } from './components/dashboards/DoctorDashboard';
import { PatientDashboard } from './components/dashboards/PatientDashboard';
import { ReceptionistDashboard } from './components/dashboards/ReceptionistDashboard';
import { NurseDashboard } from './components/dashboards/NurseDashboard';
import { AppointmentsView } from './components/modules/AppointmentsView';
import { DoctorsView } from './components/modules/DoctorsView';
import { PatientsView } from './components/modules/PatientsView';
import { MedicalRecordsView } from './components/modules/MedicalRecordsView';
import { PrescriptionsView } from './components/modules/PrescriptionsView';
import { LaboratoryView } from './components/modules/LaboratoryView';
import { PharmacyView } from './components/modules/PharmacyView';
import { BedManagementView } from './components/modules/BedManagementView';
import { BillingView } from './components/modules/BillingView';
import { DepartmentsView } from './components/modules/DepartmentsView';
import { NotificationsView } from './components/modules/NotificationsView';
import { HospitalContactView } from './components/modules/HospitalContactView';
import { SettingsView } from './components/modules/SettingsView';

const MainLayout: React.FC = () => {
  const { currentUser, currentRole, activeTab } = useHospital();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) {
    return <AuthView />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        switch (currentRole) {
          case 'admin':
            return <AdminDashboard />;
          case 'doctor':
            return <DoctorDashboard />;
          case 'patient':
            return <PatientDashboard />;
          case 'receptionist':
            return <ReceptionistDashboard />;
          case 'nurse':
            return <NurseDashboard />;
          default:
            return <AdminDashboard />;
        }
      case 'appointments':
        return <AppointmentsView />;
      case 'doctors':
        return <DoctorsView />;
      case 'patients':
        return <PatientsView />;
      case 'records':
        return <MedicalRecordsView />;
      case 'prescriptions':
        return <PrescriptionsView />;
      case 'laboratory':
        return <LaboratoryView />;
      case 'pharmacy':
        return <PharmacyView />;
      case 'beds':
        return <BedManagementView />;
      case 'billing':
        return <BillingView />;
      case 'departments':
        return <DepartmentsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'contact':
        return <HospitalContactView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <MainLayout />
    </HospitalProvider>
  );
}
