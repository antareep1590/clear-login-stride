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
