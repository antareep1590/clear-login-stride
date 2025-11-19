export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'expired';

export type IntegrationCategory = 
  | 'email_campaigns' 
  | 'social_integration' 
  | 'automation_tools' 
  | 'crm_integrations' 
  | 'job_boards';

export interface IntegrationActivity {
  id: string;
  name: string;
  count: number;
  lastUpdated: string;
  status: 'queued' | 'sent' | 'failed' | 'completed';
}

export type SeatPermissionLevel = 'view_only' | 'send_message' | 'manage_openings' | 'admin';

export interface SeatAccess {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  status: 'active' | 'inactive' | 'revoked';
  assignedDate: string;
  tags: string[];
  permissionLevel?: SeatPermissionLevel;
  /** Tags that GRANT access to candidates/openings. Additive model: more tags = more access */
  accessibleTags?: string[];
  notes?: string;
}

export interface Candidate {
  id: string;
  name: string;
  avatar?: string;
  linkedinUrl?: string;
  whatsappNumber?: string;
  connectionStatus: 'connected' | 'pending' | 'not_connected';
  lastContacted?: string;
  tags: string[];
  jobApplied?: string;
}

export interface MessageThread {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar?: string;
  channel: 'linkedin' | 'whatsapp';
  status: 'read' | 'unread';
  lastMessage: string;
  timestamp: string;
  messages: {
    id: string;
    sender: 'employee' | 'candidate';
    content: string;
    timestamp: string;
  }[];
}

export interface Integration {
  id: string;
  name: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  logo?: string;
  lastSync: string;
  owner?: string;
  account?: string;
  stats?: {
    label: string;
    value: number;
  }[];
  errorMessage?: string;
  recentActivity?: IntegrationActivity[];
  settings?: {
    syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
    notifications: boolean;
    apiKey?: string;
  };
  // Seat-based integration fields (for Uniple)
  seatBased?: boolean;
  seatsTotal?: number;
  seatsAssigned?: number;
  seatsAvailable?: number;
  seatAccess?: SeatAccess[];
  candidates?: Candidate[];
  messageThreads?: MessageThread[];
}

export interface IntegrationCategoryInfo {
  id: IntegrationCategory;
  name: string;
  icon: string;
  description: string;
  connectedCount: number;
  totalAvailable: number;
  lastSync?: string;
  hasErrors: boolean;
}
