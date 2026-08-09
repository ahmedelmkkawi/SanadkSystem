import { useState } from 'react';
import { useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ToastContainer from './components/ui/ToastContainer';

import InstructorDashboard from './components/views/InstructorDashboard';
import AdminDashboard from './components/views/AdminDashboard';

// Modals
import ApplicationModal from './components/modals/ApplicationModal';
import ScheduleModal from './components/modals/ScheduleModal';

export default function App() {
  const { role } = useApp();
  
  // Modal states
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [scheduleModalData, setScheduleModalData] = useState<{ isOpen: boolean; name: string }>({ isOpen: false, name: '' });

  const renderDashboard = () => {
    switch (role) {
      case 'instructor':
        return <InstructorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <InstructorDashboard />;
    }
  };

  return (
    <div className="flex bg-gray-50 h-screen overflow-hidden font-cairo">
      {/* Sidebar */}
      <Sidebar onOpenApplicationModal={() => setIsAppModalOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header onOpenApplicationModal={() => setIsAppModalOpen(true)} />

        {/* Dynamic Dashboard Viewport */}
        <main className="flex-1 overflow-y-auto p-8">
          {renderDashboard()}
        </main>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Modals */}
      <ApplicationModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
      />

      <ScheduleModal
        isOpen={scheduleModalData.isOpen}
        applicantName={scheduleModalData.name}
        onClose={() => setScheduleModalData({ isOpen: false, name: '' })}
      />
    </div>
  );
}

