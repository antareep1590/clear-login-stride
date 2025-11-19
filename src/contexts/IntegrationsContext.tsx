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
    id: 'uniple',
    name: 'Uniple',
    category: 'social_integration',
    status: 'connected',
    lastSync: new Date(Date.now() - 1800000).toISOString(),
    owner: 'Admin Team',
    account: 'company.uniple@example.com',
    seatBased: true,
    seatsTotal: 5,
    seatsAssigned: 3,
    seatsAvailable: 2,
    stats: [
      { label: 'Messages Sent', value: 156 },
      { label: 'Active Threads', value: 23 },
    ],
    seatAccess: [
      {
        id: 'seat1',
        employeeId: 'emp1',
        employeeName: 'John Smith',
        employeeAvatar: '',
        status: 'active',
        assignedDate: new Date(Date.now() - 86400000 * 30).toISOString(),
        tags: ['recruiter', 'tech-team'],
        permissionLevel: 'send_message',
        accessibleTags: ['senior-dev', 'react', 'backend-dev'],
        notes: 'Primary recruiter for tech roles',
      },
      {
        id: 'seat2',
        employeeId: 'emp2',
        employeeName: 'Emily Davis',
        employeeAvatar: '',
        status: 'active',
        assignedDate: new Date(Date.now() - 86400000 * 20).toISOString(),
        tags: ['recruiter', 'sales-team'],
        permissionLevel: 'manage_openings',
        accessibleTags: ['designer', 'ui-ux'],
        notes: 'Handles design and creative roles',
      },
      {
        id: 'seat3',
        employeeId: 'emp3',
        employeeName: 'Michael Brown',
        employeeAvatar: '',
        status: 'active',
        assignedDate: new Date(Date.now() - 86400000 * 10).toISOString(),
        tags: ['manager', 'tech-team'],
        permissionLevel: 'admin',
        accessibleTags: [],
        notes: 'Full admin access for all departments',
      },
    ],
    candidates: [
      {
        id: 'cand1',
        name: 'Alice Johnson',
        avatar: '',
        linkedinUrl: 'https://linkedin.com/in/alicejohnson',
        whatsappNumber: '+1234567890',
        connectionStatus: 'connected',
        lastContacted: new Date(Date.now() - 86400000).toISOString(),
        tags: ['senior-dev', 'react'],
        jobApplied: 'Senior Frontend Developer',
      },
      {
        id: 'cand2',
        name: 'Bob Martinez',
        avatar: '',
        linkedinUrl: 'https://linkedin.com/in/bobmartinez',
        connectionStatus: 'pending',
        tags: ['backend-dev', 'nodejs'],
        jobApplied: 'Backend Engineer',
      },
      {
        id: 'cand3',
        name: 'Carol White',
        avatar: '',
        whatsappNumber: '+9876543210',
        connectionStatus: 'connected',
        lastContacted: new Date(Date.now() - 86400000 * 2).toISOString(),
        tags: ['designer', 'ui-ux'],
        jobApplied: 'UI/UX Designer',
      },
    ],
    messageThreads: [
      {
        id: 'thread1',
        candidateId: 'cand1',
        candidateName: 'Alice Johnson',
        channel: 'linkedin',
        status: 'unread',
        lastMessage: 'Thanks for reaching out! I\'d love to learn more.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        messages: [
          {
            id: 'msg1',
            sender: 'employee',
            content: 'Hi Alice, we saw your profile and think you\'d be a great fit for our Senior Frontend Developer role.',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 'msg2',
            sender: 'candidate',
            content: 'Thanks for reaching out! I\'d love to learn more.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
      },
      {
        id: 'thread2',
        candidateId: 'cand3',
        candidateName: 'Carol White',
        channel: 'whatsapp',
        status: 'read',
        lastMessage: 'Great! When can we schedule an interview?',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        messages: [
          {
            id: 'msg3',
            sender: 'employee',
            content: 'Hi Carol, are you interested in our UI/UX Designer position?',
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
          {
            id: 'msg4',
            sender: 'candidate',
            content: 'Yes, I am! I have 5 years of experience in UI/UX design.',
            timestamp: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
          },
          {
            id: 'msg5',
            sender: 'employee',
            content: 'Great! When can we schedule an interview?',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
          },
        ],
      },
    ],
    settings: {
      syncFrequency: 'realtime',
      notifications: true,
    },
  },
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
