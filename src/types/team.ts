export type TeamStatus = 'active' | 'inactive';

export interface TeamKPI {
  hires: number; // Applicants who completed guarantee period (realized revenue)
  placements: number; // Applicants who joined but guarantee period not completed (provisional revenue)
  openings: number; // Openings created this year + openings with status updates this year
  interviews: number;
  revenue: number;
  feedbackScore: number;
}

export interface Team {
  id: string;
  name: string;
  department: string;
  managerIds: string[]; // Array of employee IDs who are managers
  memberIds: string[]; // Array of employee IDs who are members
  previousManagerIds?: string[]; // Array of previous manager IDs
  previousMemberIds?: string[]; // Array of previous member IDs
  avatar?: string;
  status: TeamStatus;
  createdDate: string;
  kpis: TeamKPI;
  description: string;
  targetKPIs?: TeamKPI;
  messagingEnabled?: boolean; // Admin control for internal messaging
  targetRevenue1?: number; // Primary target revenue
  targetRevenue2?: number; // Stretch target revenue
}
