import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store';
import { useApp } from './context/AppContext';
import InstructorDashboard from './components/views/InstructorDashboard';
import AdminDashboard from './components/views/AdminDashboard';
import ApplicationModal from './components/modals/ApplicationModal';
import ScheduleModal from './components/modals/ScheduleModal';
import ToastContainer from './components/ui/ToastContainer';

export const TrainingDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { role: ctxRole, switchRole, t } = useApp();
  
  // Modals state
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [scheduleModalData, setScheduleModalData] = useState({ isOpen: false, name: '' });

  // Sync logged in user role/sandbox role to the training app context role
  const activeUserRole = user?.role;

  useEffect(() => {
    if (activeUserRole === 'Instructor') {
      switchRole('instructor');
    } else if (activeUserRole === 'Training Manager') {
      switchRole('recruiter');
    }
  }, [activeUserRole, switchRole]);

  // Decide which dashboard to render
  const renderDashboard = () => {
    const targetRole = (activeUserRole === 'CEO' || activeUserRole === 'Training Manager') 
      ? ctxRole 
      : (activeUserRole === 'Instructor' ? 'instructor' : 'recruiter');

    switch (targetRole) {
      case 'recruiter':
      case 'instructor':
        return <InstructorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <InstructorDashboard />;
    }
  };

  const showRoleSwitcher = activeUserRole === 'CEO' || activeUserRole === 'Training Manager';

  return (
    <div className="space-y-6">
      {/* Role Switcher Pills for Manager/CEO */}
      {showRoleSwitcher && (
        <div className="bg-white border border-gray-155 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <div>
              <h4 className="font-extrabold text-sm text-gray-800">{t('trainingManagement')}</h4>
              <p className="text-xs text-gray-500 font-semibold">{t('chooseWorkspace')}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { role: 'recruiter', label: 'مسؤول التدريب (Training Manager)' },
              { role: 'instructor', label: 'المحاضر (Instructor)' },
              { role: 'admin', label: 'الرواتب والإحصائيات' }
            ].map((p) => (
              <button
                key={p.role}
                onClick={() => switchRole(p.role as any)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 ${
                  ctxRole === p.role
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

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
