import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee } from '@/types/employee';

interface EmployeesContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => Employee;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  bulkUpdateEmployees: (ids: string[], updates: Partial<Employee>) => void;
  bulkDeleteEmployees: (ids: string[]) => void;
  getEmployeeById: (id: string) => Employee | undefined;
  getEmployeesByManager: (managerId: string) => Employee[];
}

const EmployeesContext = createContext<EmployeesContextType | undefined>(undefined);

export const useEmployees = () => {
  const context = useContext(EmployeesContext);
  if (!context) {
    throw new Error('useEmployees must be used within EmployeesProvider');
  }
  return context;
};

const STORAGE_KEY = 'smoothire_employees';

// Mock initial data
const generateMockEmployees = (): Employee[] => {
  const now = new Date().toISOString();
  return [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@smoothire.com',
      role: 'manager',
      department: 'Recruitment',
      team: 'Tech Hiring',
      jobTitle: 'Senior Recruitment Manager',
      status: 'active',
      location: 'New York, NY',
      phone: '+1 (555) 123-4567',
      dateOfJoining: '2022-01-15',
      hireDate: '2022-01-15',
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      skills: [
        { name: 'Technical Recruiting', level: 'expert', category: 'Recruiting' },
        { name: 'Candidate Sourcing', level: 'advanced', category: 'Recruiting' },
      ],
      kpis: { hires: 45, interviews: 120, offers: 52, placements: 43, revenue: 450000 },
      createdAt: now,
      createdBy: 'system',
      updatedAt: now,
      updatedBy: 'system',
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@smoothire.com',
      role: 'recruiter',
      department: 'Recruitment',
      team: 'Sales Hiring',
      jobTitle: 'Senior Recruiter',
      managerId: '1',
      status: 'active',
      location: 'San Francisco, CA',
      phone: '+1 (555) 234-5678',
      dateOfJoining: '2022-06-01',
      hireDate: '2022-06-01',
      lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      skills: [
        { name: 'Sales Recruiting', level: 'advanced', category: 'Recruiting' },
        { name: 'Negotiation', level: 'advanced', category: 'Soft Skills' },
      ],
      kpis: { hires: 32, interviews: 95, offers: 38, placements: 30, revenue: 320000 },
      createdAt: now,
      createdBy: 'system',
      updatedAt: now,
      updatedBy: 'system',
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@smoothire.com',
      role: 'recruiter',
      department: 'Recruitment',
      team: 'Tech Hiring',
      jobTitle: 'Recruiter',
      managerId: '1',
      status: 'active',
      location: 'Austin, TX',
      phone: '+1 (555) 345-6789',
      dateOfJoining: '2023-03-15',
      hireDate: '2023-03-15',
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      skills: [
        { name: 'Software Engineering Recruiting', level: 'intermediate', category: 'Recruiting' },
      ],
      kpis: { hires: 18, interviews: 65, offers: 22, placements: 17, revenue: 180000 },
      createdAt: now,
      createdBy: 'system',
      updatedAt: now,
      updatedBy: 'system',
    },
  ];
};

export const EmployeesProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setEmployees(JSON.parse(stored));
    } else {
      const mockData = generateMockEmployees();
      setEmployees(mockData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    }
  }, []);

  const saveToStorage = (data: Employee[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setEmployees(data);
  };

  const addEmployee = (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Employee => {
    const now = new Date().toISOString();
    const newEmployee: Employee = {
      ...employeeData,
      id: Math.random().toString(36).substring(7),
      createdAt: now,
      updatedAt: now,
      createdBy: 'current-user',
      updatedBy: 'current-user',
    };
    saveToStorage([...employees, newEmployee]);
    return newEmployee;
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    const updated = employees.map(emp =>
      emp.id === id
        ? { ...emp, ...updates, updatedAt: new Date().toISOString(), updatedBy: 'current-user' }
        : emp
    );
    saveToStorage(updated);
  };

  const deleteEmployee = (id: string) => {
    saveToStorage(employees.filter(emp => emp.id !== id));
  };

  const bulkUpdateEmployees = (ids: string[], updates: Partial<Employee>) => {
    const updated = employees.map(emp =>
      ids.includes(emp.id)
        ? { ...emp, ...updates, updatedAt: new Date().toISOString(), updatedBy: 'current-user' }
        : emp
    );
    saveToStorage(updated);
  };

  const bulkDeleteEmployees = (ids: string[]) => {
    saveToStorage(employees.filter(emp => !ids.includes(emp.id)));
  };

  const getEmployeeById = (id: string) => {
    return employees.find(emp => emp.id === id);
  };

  const getEmployeesByManager = (managerId: string) => {
    return employees.filter(emp => emp.managerId === managerId);
  };

  return (
    <EmployeesContext.Provider
      value={{
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        bulkUpdateEmployees,
        bulkDeleteEmployees,
        getEmployeeById,
        getEmployeesByManager,
      }}
    >
      {children}
    </EmployeesContext.Provider>
  );
};
