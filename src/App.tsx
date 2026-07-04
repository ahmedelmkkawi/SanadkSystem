import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { NotFound } from './pages/NotFound';
import { Forbidden } from './pages/Forbidden';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { CRMLeads } from './pages/CRMLeads';
import { CRMLeadDetails } from './pages/CRMLeadDetails';
import { CRMPipeline } from './pages/CRMPipeline';
import { CRMCommunication } from './pages/CRMCommunication';
import { Tasks } from './pages/Tasks';
import { Employees } from './pages/Employees';
import { EmployeeAttendance } from './pages/EmployeeAttendance';
import { EmployeeLeaves } from './pages/EmployeeLeaves';
import { KPIBuilder } from './pages/KPIBuilder';
import { KPIEvaluations } from './pages/KPIEvaluations';
import { KPIDashboard } from './pages/KPIDashboard';
import { FinanceRevenues } from './pages/FinanceRevenues';
import { FinanceExpenses } from './pages/FinanceExpenses';
import { FinanceReports } from './pages/FinanceReports';
import { MarketingCampaigns } from './pages/MarketingCampaigns';
import { CampaignDetails } from './pages/CampaignDetails';
import { MarketingResults } from './pages/MarketingResults';
import { Files } from './pages/Files';
import { Notifications } from './pages/Notifications';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { AppProvider } from './pages/training/context/AppContext';
import { TrainingDashboard } from './pages/training/TrainingDashboard';

// import { Automations } from './pages/Automations';

// Auth Pages
import { Login } from './pages/auth/Login';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { ForceChangePassword } from './pages/auth/ForceChangePassword';

// Dev Module Pages
import { DevDashboard } from './pages/dev/DevDashboard';
import { DevProjects } from './pages/dev/DevProjects';
import { DevProjectDetails } from './pages/dev/DevProjectDetails';
import { DevTasks } from './pages/dev/DevTasks';
import { DevTaskDetails } from './pages/dev/DevTaskDetails';
import { DevWorkload } from './pages/dev/DevWorkload';
import { DevTeams } from './pages/dev/DevTeams';
import { DevBugs } from './pages/dev/DevBugs';
import { DevChangeRequests } from './pages/dev/DevChangeRequests';
import { DevReports } from './pages/dev/DevReports';
import { DevDeveloperDashboard } from './pages/dev/DevDeveloperDashboard';
import { DevClientPortal } from './pages/dev/DevClientPortal';

const router = createBrowserRouter([
  {
    path: '/auth/login',
    element: <Login />
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/auth/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/auth/force-change-password',
    element: <ForceChangePassword />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/dashboard/ceo',
        element: (
          <ProtectedRoute requiredRole="CEO">
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/gm',
        element: (
          <ProtectedRoute requiredRole="General Manager">
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/hr',
        element: (
          <ProtectedRoute requiredRole="HR Manager">
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/finance',
        element: (
          <ProtectedRoute requiredRole="Finance Manager">
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/marketing',
        element: (
          <ProtectedRoute requiredRole="Marketing Manager">
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/sales-manager',
        element: (
          <ProtectedRoute requiredRole="Sales Manager">
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/team-leader',
        element: (
          <ProtectedRoute requiredRole="Team Leader">
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/employee',
        element: (
          <ProtectedRoute requiredRole="Employee">
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/client',
        element: (
          <ProtectedRoute requiredRole="Client">
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/crm/dashboard',
        element: (
          <ProtectedRoute requiredPermission="VIEW_LEADS">
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/crm/leads',
        element: (
          <ProtectedRoute requiredPermission="VIEW_LEADS">
            <CRMLeads />
          </ProtectedRoute>
        )
      },
      {
        path: '/crm/leads/:id',
        element: (
          <ProtectedRoute requiredPermission="VIEW_LEADS">
            <CRMLeadDetails />
          </ProtectedRoute>
        )
      },
      {
        path: '/crm/pipeline',
        element: (
          <ProtectedRoute requiredPermission="VIEW_LEADS">
            <CRMPipeline />
          </ProtectedRoute>
        )
      },
      {
        path: '/crm/communication',
        element: (
          <ProtectedRoute requiredPermission="VIEW_LEADS">
            <CRMCommunication />
          </ProtectedRoute>
        )
      },
      {
        path: '/tasks',
        element: <Tasks />
      },
      {
        path: '/employees',
        element: (
          <ProtectedRoute requiredPermission="VIEW_EMPLOYEES">
            <Employees />
          </ProtectedRoute>
        )
      },
      {
        path: '/employees/attendance',
        element: <EmployeeAttendance />
      },
      {
        path: '/employees/leaves',
        element: <EmployeeLeaves />
      },
      {
        path: '/kpi/templates',
        element: (
          <ProtectedRoute requiredPermission="MANAGE_KPI">
            <KPIBuilder />
          </ProtectedRoute>
        )
      },
      {
        path: '/kpi/evaluations',
        element: (
          <ProtectedRoute requiredPermission="VIEW_KPI">
            <KPIEvaluations />
          </ProtectedRoute>
        )
      },
      {
        path: '/kpi/dashboard',
        element: (
          <ProtectedRoute requiredPermission="VIEW_KPI">
            <KPIDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/finance/revenues',
        element: (
          <ProtectedRoute requiredPermission="VIEW_FINANCE">
            <FinanceRevenues />
          </ProtectedRoute>
        )
      },
      {
        path: '/finance/expenses',
        element: (
          <ProtectedRoute requiredPermission="VIEW_FINANCE">
            <FinanceExpenses />
          </ProtectedRoute>
        )
      },
      {
        path: '/finance/reports',
        element: (
          <ProtectedRoute requiredPermission="VIEW_FINANCE">
            <FinanceReports />
          </ProtectedRoute>
        )
      },
      {
        path: '/marketing/campaigns',
        element: (
          <ProtectedRoute requiredPermission="VIEW_MARKETING">
            <MarketingCampaigns />
          </ProtectedRoute>
        )
      },
      {
        path: '/marketing/campaigns/:id',
        element: (
          <ProtectedRoute requiredPermission="VIEW_MARKETING">
            <CampaignDetails />
          </ProtectedRoute>
        )
      },
      {
        path: '/marketing/results',
        element: (
          <ProtectedRoute requiredPermission="VIEW_MARKETING">
            <MarketingResults />
          </ProtectedRoute>
        )
      },
      {
        path: '/files',
        element: <Files />
      },
      {
        path: '/training',
        element: (
          <AppProvider>
            <TrainingDashboard />
          </AppProvider>
        )
      },
      {
        path: '/notifications',
        element: <Notifications />
      },
      {
        path: '/reports',
        element: (
          <ProtectedRoute requiredPermission="VIEW_REPORTS">
            <Reports />
          </ProtectedRoute>
        )
      },
      {
        path: '/settings',
        element: (
          <ProtectedRoute requiredPermission="MANAGE_SETTINGS">
            <Settings />
          </ProtectedRoute>
        )
      },

      // Dev Module Routes
      {
        path: '/dev/dashboard',
        element: (
          <ProtectedRoute>
            <DevDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/dev/projects',
        element: (
          <ProtectedRoute>
            <DevProjects />
          </ProtectedRoute>
        )
      },
      {
        path: '/dev/projects/:id',
        element: (
          <ProtectedRoute>
            <DevProjectDetails />
          </ProtectedRoute>
        )
      },
      {
        path: '/dev/tasks',
        element: (
          <ProtectedRoute>
            <DevTasks />
          </ProtectedRoute>
        )
      },
      {
        path: '/dev/tasks/:id',
        element: (
          <ProtectedRoute>
            <DevTaskDetails />
          </ProtectedRoute>
        )
      },
      {
        path: '/dev/workload',
        element: (
          <ProtectedRoute>
            <DevWorkload />
          </ProtectedRoute>
        )
      },
      {
        path: '/dev/teams',
        element: (
          <ProtectedRoute>
            <DevTeams />
          </ProtectedRoute>
        )
      },
      {
        path: '/dev/bugs',
        element: (
          <ProtectedRoute>
            <DevBugs />
          </ProtectedRoute>
        )
      },
      {
        path: '/dev/change-requests',
        element: (
          <ProtectedRoute>
            <DevChangeRequests />
          </ProtectedRoute>
        )
      },
      {
        path: '/dev/reports',
        element: (
          <ProtectedRoute>
            <DevReports />
          </ProtectedRoute>
        )
      },
      {
        path: '/dev/developer-dashboard',
        element: (
          <ProtectedRoute>
            <DevDeveloperDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/dev/client-portal',
        element: (
          <ProtectedRoute>
            <DevClientPortal />
          </ProtectedRoute>
        )
      },
      /*
      {
        path: '/automations',
        element: (
          <ProtectedRoute requiredPermission="MANAGE_AUTOMATIONS">
            <Automations />
          </ProtectedRoute>
        )
      },
      */
      {
        path: '/404',
        element: <NotFound />
      },
      {
        path: '/403',
        element: <Forbidden />
      },
      {
        path: '*',
        element: <Navigate to="/404" replace />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
