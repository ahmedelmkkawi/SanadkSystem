import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserRole =
  | 'CEO'
  | 'General Manager'
  | 'HR Manager'
  | 'Finance Manager'
  | 'Marketing Manager'
  | 'Sales Manager'
  | 'Team Leader'
  | 'Employee'
  | 'Client'
  | 'Training Manager'
  | 'Instructor'
  | 'Student'
  | 'Tech Lead'
  | 'Developer'
  | 'Team Manager'
  | 'Department Manager'
  | 'Account Manager'
  | 'Web Team Leader'
  | 'Mobile Team Leader'
  | 'Automation Team Leader';

export type Permission =
  | 'VIEW_LEADS'
  | 'MANAGE_LEADS'
  | 'VIEW_FINANCE'
  | 'VIEW_FINANCE_SENSITIVE'
  | 'VIEW_EMPLOYEES'
  | 'MANAGE_EMPLOYEES'
  | 'VIEW_KPI'
  | 'MANAGE_KPI'
  | 'VIEW_MARKETING'
  | 'MANAGE_MARKETING'
  | 'VIEW_REPORTS'
  | 'MANAGE_SETTINGS'
  | 'MANAGE_AUTOMATIONS'
  | 'VIEW_TASKS'
  | 'MANAGE_TASKS';

export type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Pending First Login';

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  address?: string;
  phone?: string;
  department?: string;
  position?: string;
  role: UserRole;
  permissions: Permission[];
  status: UserStatus;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  registeredUsers: Array<User & { password?: string }>;
}

export const rolePermissions: Record<UserRole, Permission[]> = {
  'CEO': [
    'VIEW_LEADS', 'MANAGE_LEADS', 'VIEW_FINANCE', 'VIEW_FINANCE_SENSITIVE',
    'VIEW_EMPLOYEES', 'MANAGE_EMPLOYEES', 'VIEW_KPI', 'MANAGE_KPI',
    'VIEW_MARKETING', 'MANAGE_MARKETING', 'VIEW_REPORTS', 'MANAGE_SETTINGS',
    'MANAGE_AUTOMATIONS', 'VIEW_TASKS', 'MANAGE_TASKS'
  ],
  'General Manager': [
    'VIEW_LEADS', 'MANAGE_LEADS', 'VIEW_FINANCE', 'VIEW_EMPLOYEES',
    'MANAGE_EMPLOYEES', 'VIEW_KPI', 'MANAGE_KPI', 'VIEW_MARKETING',
    'MANAGE_MARKETING', 'VIEW_REPORTS', 'MANAGE_AUTOMATIONS', 'VIEW_TASKS', 'MANAGE_TASKS'
  ],
  'HR Manager': [
    'VIEW_EMPLOYEES', 'MANAGE_EMPLOYEES', 'VIEW_KPI', 'MANAGE_KPI',
    'VIEW_REPORTS', 'VIEW_TASKS', 'MANAGE_TASKS'
  ],
  'Finance Manager': [
    'VIEW_FINANCE', 'VIEW_FINANCE_SENSITIVE'
  ],
  'Marketing Manager': [
    'VIEW_LEADS', 'MANAGE_LEADS', 'VIEW_MARKETING', 'MANAGE_MARKETING',
    'VIEW_REPORTS', 'VIEW_TASKS', 'MANAGE_TASKS'
  ],
  'Sales Manager': [
    'VIEW_LEADS', 'MANAGE_LEADS', 'VIEW_REPORTS', 'VIEW_TASKS', 'MANAGE_TASKS'
  ],
  'Team Leader': [
    'VIEW_LEADS', 'VIEW_KPI', 'VIEW_TASKS', 'MANAGE_TASKS', 'VIEW_REPORTS'
  ],
  'Employee': [
    'VIEW_TASKS', 'VIEW_KPI', 'VIEW_REPORTS'
  ],
  'Client': [],
  'Training Manager': [
    'VIEW_EMPLOYEES', 'VIEW_REPORTS', 'VIEW_TASKS', 'MANAGE_TASKS'
  ],
  'Instructor': [
    'VIEW_TASKS'
  ],
  'Student': [
    'VIEW_TASKS'
  ],
  'Tech Lead': [
    'VIEW_TASKS', 'MANAGE_TASKS', 'VIEW_REPORTS', 'VIEW_EMPLOYEES', 'MANAGE_EMPLOYEES'
  ],
  'Developer': [
    'VIEW_TASKS'
  ],
  'Team Manager': [
    'VIEW_TASKS', 'MANAGE_TASKS', 'VIEW_REPORTS'
  ],
  'Department Manager': [
    'VIEW_TASKS', 'MANAGE_TASKS', 'VIEW_REPORTS', 'VIEW_EMPLOYEES', 'MANAGE_EMPLOYEES'
  ],
  'Account Manager': [
    'VIEW_LEADS', 'MANAGE_LEADS', 'VIEW_TASKS', 'MANAGE_TASKS', 'VIEW_REPORTS'
  ],
  'Web Team Leader': [
    'VIEW_TASKS', 'MANAGE_TASKS', 'VIEW_REPORTS'
  ],
  'Mobile Team Leader': [
    'VIEW_TASKS', 'MANAGE_TASKS', 'VIEW_REPORTS'
  ],
  'Automation Team Leader': [
    'VIEW_TASKS', 'MANAGE_TASKS', 'VIEW_REPORTS'
  ]
};

const defaultUsers: Array<User & { password?: string }> = [
  { id: 'u1', name: 'أحمد علي (CEO)', email: 'ceo@company.com', role: 'CEO', permissions: rolePermissions['CEO'], password: 'Password@123', status: 'Active', department: 'Management' },
  { id: 'u2', name: 'ياسر جلال (GM)', email: 'gm@company.com', role: 'General Manager', permissions: rolePermissions['General Manager'], password: 'Password@123', status: 'Active', department: 'Management' },
  { id: 'u3', name: 'سارة خالد (HR)', email: 'hr@company.com', role: 'HR Manager', permissions: rolePermissions['HR Manager'], password: 'Password@123', status: 'Active', department: 'HR' },
  { id: 'u4', name: 'ماجد سليمان (Finance Manager)', email: 'finance@company.com', role: 'Finance Manager', permissions: rolePermissions['Finance Manager'], password: 'Password@123', status: 'Active', department: 'Finance' },
  { id: 'u5', name: 'دينا الشافعي (Marketing)', email: 'marketing@company.com', role: 'Marketing Manager', permissions: rolePermissions['Marketing Manager'], password: 'Password@123', status: 'Active', department: 'Marketing' },
  { id: 'u6', name: 'محمود عبد السلام (Sales)', email: 'sales.manager@company.com', role: 'Sales Manager', permissions: rolePermissions['Sales Manager'], password: 'Password@123', status: 'Active', department: 'Sales' },
  { id: 'u7', name: 'كريم نادر (Team Leader)', email: 'teamleader@company.com', role: 'Team Leader', permissions: rolePermissions['Team Leader'], password: 'Password@123', status: 'Active', department: 'Software Development' },
  { id: 'u8', name: 'محمد حسن (Employee)', email: 'employee@company.com', role: 'Employee', permissions: rolePermissions['Employee'], password: 'Password@123', status: 'Active', department: 'Sales' },
  { id: 'u9', name: 'شركة النور (Client)', email: 'client@company.com', role: 'Client', permissions: rolePermissions['Client'], password: 'Password@123', status: 'Active', department: 'Client' },
  { id: 'u10', name: 'أمل سامي (Training Mgr)', email: 'training.manager@company.com', role: 'Training Manager', permissions: rolePermissions['Training Manager'], password: 'Password@123', status: 'Active', department: 'Training' },
  { id: 'u11', name: 'كريم محمود (Instructor)', email: 'instructor@company.com', role: 'Instructor', permissions: rolePermissions['Instructor'], password: 'Password@123', status: 'Active', department: 'Training' },
  { id: 'u13', name: 'أنس العمري (Tech Lead)', email: 'techlead@company.com', role: 'Tech Lead', permissions: rolePermissions['Tech Lead'], password: 'Password@123', status: 'Active', department: 'Software Development' },
  { id: 'u14', name: 'زياد عمرو (Developer)', email: 'developer@company.com', role: 'Developer', permissions: rolePermissions['Developer'], password: 'Password@123', status: 'Active', department: 'Software Development' },
  { id: 'u15', name: 'د. حاتم الشريف (Dept Manager)', email: 'dev.manager@company.com', role: 'Department Manager', permissions: rolePermissions['Department Manager'], password: 'Password@123', status: 'Active', department: 'Software Development' },
  { id: 'u16', name: 'رانيا مجدي (Account Manager)', email: 'account.manager@company.com', role: 'Account Manager', permissions: rolePermissions['Account Manager'], password: 'Password@123', status: 'Active', department: 'Software Development' },
  { id: 'u17', name: 'م. إسلام عادل (Web Team Leader)', email: 'tl.web@company.com', role: 'Web Team Leader', permissions: rolePermissions['Web Team Leader'], password: 'Password@123', status: 'Active', department: 'Software Development' },
  { id: 'u18', name: 'م. حسام السيد (Mobile Team Leader)', email: 'tl.mobile@company.com', role: 'Mobile Team Leader', permissions: rolePermissions['Mobile Team Leader'], password: 'Password@123', status: 'Active', department: 'Software Development' },
  { id: 'u19', name: 'م. دينا فتحي (Automation TL)', email: 'tl.automation@company.com', role: 'Automation Team Leader', permissions: rolePermissions['Automation Team Leader'], password: 'Password@123', status: 'Active', department: 'Software Development' }
];

const getStoredAuth = () => {
  const token = localStorage.getItem('auth_token');
  const userJson = localStorage.getItem('auth_user');
  if (token && userJson) {
    try {
      const parsed = JSON.parse(userJson) as User;
      return {
        user: parsed,
        token,
        isAuthenticated: true
      };
    } catch {
      // Ignore
    }
  }
  // Default: CEO logged in for demo convenience
  return {
    user: defaultUsers[0],
    token: 'mock-jwt-token-ceo',
    isAuthenticated: true
  };
};

const storedAuth = getStoredAuth();

const initialState: AuthState = {
  user: storedAuth.user,
  isAuthenticated: storedAuth.isAuthenticated,
  token: storedAuth.token,
  loading: false,
  error: null,
  registeredUsers: defaultUsers
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    },
    registerSuccess(state, action: PayloadAction<User & { password?: string }>) {
      state.registeredUsers.push(action.payload);
    },
    createUser(state, action: PayloadAction<User & { password?: string }>) {
      state.registeredUsers.push(action.payload);
    },
    changePasswordAndActivate(state, action: PayloadAction<{ email: string; newPassword: string }>) {
      const uIdx = state.registeredUsers.findIndex(u => u.email.toLowerCase() === action.payload.email.toLowerCase());
      if (uIdx !== -1) {
        state.registeredUsers[uIdx].password = action.payload.newPassword;
        state.registeredUsers[uIdx].status = 'Active';
      }
      if (state.user && state.user.email.toLowerCase() === action.payload.email.toLowerCase()) {
        state.user.status = 'Active';
        localStorage.setItem('auth_user', JSON.stringify(state.user));
      }
    },
    updateUserStatus(state, action: PayloadAction<{ id: string; status: UserStatus }>) {
      const uIdx = state.registeredUsers.findIndex(u => u.id === action.payload.id);
      if (uIdx !== -1) {
        state.registeredUsers[uIdx].status = action.payload.status;
      }
      if (state.user && state.user.id === action.payload.id) {
        state.user.status = action.payload.status;
        localStorage.setItem('auth_user', JSON.stringify(state.user));
      }
    },
    updateUserRoleAndPermissions(state, action: PayloadAction<{ id: string; role: UserRole; permissions: Permission[] }>) {
      const uIdx = state.registeredUsers.findIndex(u => u.id === action.payload.id);
      if (uIdx !== -1) {
        state.registeredUsers[uIdx].role = action.payload.role;
        state.registeredUsers[uIdx].permissions = action.payload.permissions;
      }
      if (state.user && state.user.id === action.payload.id) {
        state.user.role = action.payload.role;
        state.user.permissions = action.payload.permissions;
        localStorage.setItem('auth_user', JSON.stringify(state.user));
      }
    },
    updateUserDepartment(state, action: PayloadAction<{ id: string; department: string }>) {
      const uIdx = state.registeredUsers.findIndex(u => u.id === action.payload.id);
      if (uIdx !== -1) {
        state.registeredUsers[uIdx].department = action.payload.department;
      }
      if (state.user && state.user.id === action.payload.id) {
        state.user.department = action.payload.department;
        localStorage.setItem('auth_user', JSON.stringify(state.user));
      }
    },
    resetUserPassword(state, action: PayloadAction<{ id: string; tempPassword: string }>) {
      const uIdx = state.registeredUsers.findIndex(u => u.id === action.payload.id);
      if (uIdx !== -1) {
        state.registeredUsers[uIdx].password = action.payload.tempPassword;
        state.registeredUsers[uIdx].status = 'Pending First Login';
      }
      if (state.user && state.user.id === action.payload.id) {
        state.user.status = 'Pending First Login';
        localStorage.setItem('auth_user', JSON.stringify(state.user));
      }
    }
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerSuccess,
  createUser,
  changePasswordAndActivate,
  updateUserStatus,
  updateUserRoleAndPermissions,
  updateUserDepartment,
  resetUserPassword
} = authSlice.actions;

export default authSlice.reducer;
