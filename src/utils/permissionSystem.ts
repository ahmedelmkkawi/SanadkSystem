export type DepartmentName = 
  | 'Sales' 
  | 'SoftwareDevelopment' 
  | 'HR' 
  | 'Finance' 
  | 'Support' 
  | 'Operations'
  | 'Training';

export type UserRole =
  | 'CEO'
  | 'Tech Lead'
  | 'Team Manager'
  | 'Developer'
  | 'Sales Manager'
  | 'Sales Employee'
  | 'General Manager'
  | 'HR Manager'
  | 'Finance Manager'
  | 'Marketing Manager'
  | 'Team Leader'
  | 'Employee'
  | 'Client'
  | 'Training Manager'
  | 'Instructor'
  | 'Student';

// Modules mapping
export type SystemModule =
  | 'CRM'
  | 'Tasks'
  | 'Employees'
  | 'KPI'
  | 'Finance'
  | 'Marketing'
  | 'Files'
  | 'SoftwareDevelopment'
  | 'Reports'
  | 'Settings'
  | 'ActivityLogs'
  | 'Training';

export interface DepartmentConfig {
  name: DepartmentName;
  roles: UserRole[];
  allowedModules: SystemModule[];
}

export const DEPARTMENTS: Record<DepartmentName, DepartmentConfig> = {
  Sales: {
    name: 'Sales',
    roles: ['CEO', 'Sales Manager', 'Sales Employee', 'General Manager', 'Marketing Manager', 'Employee'],
    allowedModules: ['CRM', 'Tasks', 'Employees', 'KPI', 'Finance', 'Marketing', 'Files', 'Reports', 'Settings']
  },
  SoftwareDevelopment: {
    name: 'SoftwareDevelopment',
    roles: ['CEO', 'Tech Lead', 'Team Manager', 'Developer', 'Team Leader'],
    allowedModules: ['SoftwareDevelopment']
  },
  HR: {
    name: 'HR',
    roles: ['CEO', 'HR Manager'],
    allowedModules: ['Employees', 'KPI', 'Files', 'Settings']
  },
  Finance: {
    name: 'Finance',
    roles: ['CEO', 'Finance Manager'],
    allowedModules: ['Finance', 'Files', 'Reports']
  },
  Support: {
    name: 'Support',
    roles: ['CEO'],
    allowedModules: ['Files']
  },
  Operations: {
    name: 'Operations',
    roles: ['CEO'],
    allowedModules: ['Files']
  },
  Training: {
    name: 'Training',
    roles: ['CEO', 'Training Manager', 'Instructor', 'Student'],
    allowedModules: ['Training', 'Tasks', 'Files']
  }
};

/**
 * Gets all departments a role belongs to
 */
export function getDepartmentsForRole(role: UserRole): DepartmentName[] {
  const depts: DepartmentName[] = [];
  (Object.keys(DEPARTMENTS) as DepartmentName[]).forEach((deptKey) => {
    if (DEPARTMENTS[deptKey].roles.includes(role)) {
      depts.push(deptKey);
    }
  });
  return depts;
}

/**
 * Check if a role can access a module
 */
export function isModuleAllowed(role: UserRole, moduleName: SystemModule): boolean {
  // CEO has access to all modules without exception
  if (role === 'CEO') {
    return true;
  }
  
  const depts = getDepartmentsForRole(role);
  return depts.some((deptName) => DEPARTMENTS[deptName].allowedModules.includes(moduleName));
}

/**
 * Check if a role can access a path
 */
export function canAccessPath(role: UserRole, path: string): boolean {
  // CEO has full access to all paths except specific client-only pages if needed
  if (role === 'CEO') {
    return true;
  }

  // Protect Training routes
  if (path.startsWith('/training')) {
    const trainingRoles: UserRole[] = ['CEO', 'Training Manager', 'Instructor', 'Student'];
    return trainingRoles.includes(role);
  }

  // Protect Software Development routes
  if (path.startsWith('/dev/')) {
    // Client portal has special access rules
    if (path.startsWith('/dev/client-portal')) {
      return role === 'Client';
    }
    // Software Development department roles can access
    const devRoles: UserRole[] = ['CEO', 'Tech Lead', 'Team Manager', 'Developer', 'Team Leader'];
    return devRoles.includes(role);
  }

  // Protect CEO-only system logs
  if (path.startsWith('/ceo/')) {
    return false;
  }

  // Protect Files route from non-Sales/non-admin users
  if (path.startsWith('/files')) {
    const allowedRoles: UserRole[] = ['Sales Manager', 'Sales Employee', 'Employee', 'General Manager', 'Marketing Manager', 'HR Manager', 'Finance Manager'];
    return allowedRoles.includes(role);
  }

  // Protect Sales/CRM routes
  if (path.startsWith('/crm/') || path === '/crm') {
    const salesRoles: UserRole[] = ['Sales Manager', 'Sales Employee', 'Employee', 'General Manager', 'Marketing Manager'];
    return salesRoles.includes(role);
  }

  // Default allows navigation, dashboard is custom routed
  return true;
}
