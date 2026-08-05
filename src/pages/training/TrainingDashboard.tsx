import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store';
import { useApp } from './context/AppContext';
import InstructorDashboard from './components/views/InstructorDashboard';
import StudentDashboard from './components/views/StudentDashboard';
import AdminDashboard from './components/views/AdminDashboard';
import ApplicationModal from './components/modals/ApplicationModal';
import ScheduleModal from './components/modals/ScheduleModal';
import SessionRatingModal from './components/modals/SessionRatingModal';
import ToastContainer from './components/ui/ToastContainer';

export const TrainingDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { role: ctxRole, switchRole, t } = useApp();
  
  // Modals state
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [scheduleModalData, setScheduleModalData] = useState({ isOpen: false, name: '' });
  const [ratingModalData, setRatingModalData] = useState({ isOpen: false, sessionName: '', rowId: '' });
  const [sessionRatings, setSessionRatings] = useState<Record<string, number>>({});

  // Sync logged in user role/sandbox role to the training app context role
  const activeUserRole = user?.role;

  useEffect(() => {
    if (activeUserRole === 'Instructor') {
      switchRole('instructor');
    } else if (activeUserRole === 'Student') {
      switchRole('student');
    } else if (activeUserRole === 'Training Manager') {
      // Default to instructor schedule for Training Manager
      switchRole('instructor');
    }
  }, [activeUserRole, switchRole]);

  // Decide which dashboard to render
  const renderDashboard = () => {
    const targetRole = (activeUserRole === 'CEO' || activeUserRole === 'Training Manager') 
      ? ctxRole 
      : (activeUserRole === 'Instructor' ? 'instructor' : (activeUserRole === 'Student' ? 'student' : 'instructor'));

    switch (targetRole) {
      case 'instructor':
        return <InstructorDashboard />;
      case 'student':
        return (
          <StudentDashboard
            sessionRatings={sessionRatings}
            onOpenRatingModal={(sessionName, rowId) => setRatingModalData({ isOpen: true, sessionName, rowId })}
          />
        );
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
              { role: 'instructor', labelKey: 'instructorWorkspace' },
              { role: 'student', labelKey: 'studentPortal' },
              { role: 'admin', labelKey: 'financeStats' }
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
                {t(p.labelKey)}
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

      <SessionRatingModal
        isOpen={ratingModalData.isOpen}
        sessionName={ratingModalData.sessionName}
        onClose={() => setRatingModalData({ isOpen: false, sessionName: '', rowId: '' })}
        onRated={(stars) => {
          setSessionRatings(prev => ({ ...prev, [ratingModalData.rowId]: stars }));
        }}
      />
    </div>
  );
};

export default TrainingDashboard;
