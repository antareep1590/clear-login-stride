export type EmployeeStatus = 'active' | 'inactive' | 'invited' | 'pending';
export type EmployeeRole = 'recruiter' | 'manager' | 'admin' | 'coordinator' | 'executive';

export interface Employee {
  id: string;
  // Basic Info
  name: string;
  preferredName?: string;
  email: string;
  avatar?: string;
  
  // Role & Organization
  role: EmployeeRole;
  department: string;
  team?: string;
  jobTitle: string;
  managerId?: string;
  status: EmployeeStatus;
  
  // Contact
  phone?: string;
  secondaryPhone?: string;
  address?: string;
  location?: string;
  
  // Emergency Contact
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  
  // Social
  linkedin?: string;
  github?: string;
  twitter?: string;
  
  // Job Details
  dateOfJoining: string;
  hireDate: string;
  contractStart?: string;
  contractEnd?: string;
  
  // Compensation (admin only)
  salary?: number;
  salaryType?: 'hourly' | 'monthly' | 'yearly';
  bonus?: number;
  commission?: number;
  
  // Compliance
  workPermit?: string;
  idNumber?: string;
  passportNumber?: string;
  
  // Education & Experience
  education?: {
    school: string;
    degree: string;
    field: string;
    startYear: number;
    endYear: number;
  }[];
  
  experience?: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    responsibilities: string;
  }[];
  
  // Skills
  skills?: {
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category?: string;
  }[];
  
  languages?: {
    language: string;
    proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
  }[];
  
  // Performance
  kpis?: {
    hires: number;
    interviews: number;
    offers: number;
    placements: number;
    revenue: number;
  };
  
  // Activity
  lastLogin?: string;
  lastActivity?: string;
  
  // Metadata
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  notes?: string;
  
  // Custom Fields
  customFields?: Record<string, any>;
}
