export type TeamStatus = 'active' | 'inactive';

export interface TeamKPI {
  hires: number;
  placements: number;
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
  avatar?: string;
  status: TeamStatus;
  createdDate: string;
  kpis: TeamKPI;
  description: string;
  targetKPIs?: TeamKPI;
}
