import { createContext, useContext, useState, ReactNode } from 'react';
import { Integration, IntegrationCategory } from '@/types/integration';

interface IntegrationsContextType {
  integrations: Integration[];
  connectIntegration: (id: string) => void;
  disconnectIntegration: (id: string) => void;
  syncIntegration: (id: string) => void;
  updateIntegrationSettings: (id: string, settings: any) => void;
}

const IntegrationsContext = createContext<IntegrationsContextType | undefined>(undefined);

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'MailChimp',
    category: 'email_campaigns',
    status: 'connected',
    lastSync: '2024-01-15T10:30:00Z',
    owner: 'admin@company.com',
    account: 'marketing@company.com',
    stats: [
      { label: 'Emails Sent', value: 15420 },
      { label: 'Campaigns', value: 12 },
    ],
    recentActivity: [
      { id: 'a1', name: 'Welcome Series', count: 245, lastUpdated: '2024-01-15T10:30:00Z', status: 'sent' },
      { id: 'a2', name: 'Newsletter Jan', count: 1250, lastUpdated: '2024-01-14T08:00:00Z', status: 'sent' },
    ],
    settings: {
      syncFrequency: 'hourly',
      notifications: true,
    },
  },
  {
    id: '2',
    name: 'Gmail',
    category: 'email_campaigns',
    status: 'connected',
    lastSync: '2024-01-15T11:00:00Z',
    owner: 'admin@company.com',
    account: 'info@company.com',
    stats: [
      { label: 'Emails Sent', value: 3240 },
    ],
    settings: {
      syncFrequency: 'realtime',
      notifications: true,
    },
  },
  {
    id: '3',
    name: 'Zoho Campaign',
    category: 'email_campaigns',
    status: 'disconnected',
    lastSync: '2024-01-10T14:20:00Z',
  },
  {
    id: '4',
    name: 'LinkedIn',
    category: 'social_integration',
    status: 'connected',
    lastSync: '2024-01-15T09:45:00Z',
    owner: 'admin@company.com',
    stats: [
      { label: 'Posts Published', value: 45 },
      { label: 'Connections', value: 2340 },
    ],
    settings: {
      syncFrequency: 'daily',
      notifications: true,
    },
  },
  {
    id: '5',
    name: 'Twitter/X',
    category: 'social_integration',
    status: 'expired',
    lastSync: '2024-01-01T12:00:00Z',
    errorMessage: 'Authorization expired. Please reconnect.',
  },
  {
    id: '6',
    name: 'Zapier',
    category: 'automation_tools',
    status: 'connected',
    lastSync: '2024-01-15T11:15:00Z',
    owner: 'admin@company.com',
    stats: [
      { label: 'Active Zaps', value: 8 },
      { label: 'Tasks This Month', value: 1240 },
    ],
    settings: {
      syncFrequency: 'realtime',
      notifications: true,
    },
  },
  {
    id: '7',
    name: 'n8n',
    category: 'automation_tools',
    status: 'disconnected',
    lastSync: '2024-01-05T16:30:00Z',
  },
  {
    id: '8',
    name: 'Salesforce',
    category: 'crm_integrations',
    status: 'error',
    lastSync: '2024-01-15T08:00:00Z',
    errorMessage: 'API rate limit exceeded. Retrying in 1 hour.',
    stats: [
      { label: 'Contacts Synced', value: 5240 },
    ],
  },
  {
    id: '9',
    name: 'HubSpot',
    category: 'crm_integrations',
    status: 'disconnected',
    lastSync: '2024-01-08T10:00:00Z',
  },
  {
    id: '10',
    name: 'Indeed',
    category: 'job_boards',
    status: 'connected',
    lastSync: '2024-01-15T07:30:00Z',
    owner: 'hr@company.com',
    stats: [
      { label: 'Active Jobs', value: 12 },
      { label: 'Applications', value: 156 },
    ],
    settings: {
      syncFrequency: 'daily',
      notifications: true,
    },
  },
  {
    id: '11',
    name: 'LinkedIn Jobs',
    category: 'job_boards',
    status: 'connected',
    lastSync: '2024-01-15T08:00:00Z',
    owner: 'hr@company.com',
    stats: [
      { label: 'Active Jobs', value: 8 },
      { label: 'Applications', value: 89 },
    ],
    settings: {
      syncFrequency: 'daily',
      notifications: false,
    },
  },
];

export function IntegrationsProvider({ children }: { children: ReactNode }) {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);

  const connectIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? {
              ...integration,
              status: 'connected',
              lastSync: new Date().toISOString(),
              errorMessage: undefined,
            }
          : integration
      )
    );
  };

  const disconnectIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, status: 'disconnected' }
          : integration
      )
    );
  };

  const syncIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, lastSync: new Date().toISOString() }
          : integration
      )
    );
  };

  const updateIntegrationSettings = (id: string, settings: any) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, settings: { ...integration.settings, ...settings } }
          : integration
      )
    );
  };

  return (
    <IntegrationsContext.Provider
      value={{
        integrations,
        connectIntegration,
        disconnectIntegration,
        syncIntegration,
        updateIntegrationSettings,
      }}
    >
      {children}
    </IntegrationsContext.Provider>
  );
}

export function useIntegrations() {
  const context = useContext(IntegrationsContext);
  if (context === undefined) {
    throw new Error('useIntegrations must be used within an IntegrationsProvider');
  }
  return context;
}
