import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store';
import { useApp } from './context/AppContext';
import InstructorDashboard from './components/views/InstructorDashboard';
import AdminDashboard from './components/views/AdminDashboard';
import CeoInstructorsView from './components/views/CeoInstructorsView';
import ApplicationModal from './components/modals/ApplicationModal';
import ScheduleModal from './components/modals/ScheduleModal';
import ToastContainer from './components/ui/ToastContainer';

interface TrainingDashboardProps {
  defaultView?: 'main' | 'salaries';
}

export const TrainingDashboard: React.FC<TrainingDashboardProps> = ({ defaultView = 'main' }) => {
  const { user } = useAppSelector((state) => state.auth);
  const { switchRole } = useApp();
  
  // Modals state
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [scheduleModalData, setScheduleModalData] = useState({ isOpen: false, name: '' });

  // Sync logged in user role/sandbox role to the training app context role
  const activeUserRole = user?.role;
  const isCeo = activeUserRole === 'CEO';

  useEffect(() => {
    if (activeUserRole === 'Instructor') {
      switchRole('instructor');
    } else if (activeUserRole === 'Training Manager') {
      switchRole('recruiter');
    }
  }, [activeUserRole, switchRole]);

  // Decide which dashboard to render
  const renderDashboard = () => {
    if (isCeo) {
      return <CeoInstructorsView />;
    }

    if (defaultView === 'salaries') {
      return <AdminDashboard />;
    }

    return <InstructorDashboard />;
  };

  return (
    <div className="space-y-6">
      {/* Main viewport */}
      <div className="bg-gray-50 rounded-2xl">
        {renderDashboard()}
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
};

export default TrainingDashboard;
