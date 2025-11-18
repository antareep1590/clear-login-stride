import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client, ClientContact, ClientDocument, CommissionRule, ClientFeedback } from '@/types/client';

interface ClientsContextType {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  archiveClient: (id: string) => void;
  bulkUpdateClients: (ids: string[], updates: Partial<Client>) => void;
  bulkDeleteClients: (ids: string[]) => void;
  getClientById: (id: string) => Client | undefined;
  getClientsByOwner: (ownerId: string) => Client[];
  getClientsByTeam: (teamId: string) => Client[];
  addContact: (clientId: string, contact: Omit<ClientContact, 'id'>) => void;
  updateContact: (clientId: string, contactId: string, updates: Partial<ClientContact>) => void;
  deleteContact: (clientId: string, contactId: string) => void;
  addDocument: (clientId: string, document: Omit<ClientDocument, 'id'>) => void;
  updateDocument: (clientId: string, docId: string, updates: Partial<ClientDocument>) => void;
  deleteDocument: (clientId: string, docId: string) => void;
  addCommissionRule: (clientId: string, rule: Omit<CommissionRule, 'id'>) => void;
  updateCommissionRule: (clientId: string, ruleId: string, updates: Partial<CommissionRule>) => void;
  addFeedback: (clientId: string, feedback: Omit<ClientFeedback, 'id'>) => void;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const useClients = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
};

const generateMockClients = (): Client[] => {
  const now = new Date().toISOString();
  
  return [
    {
      id: '1',
      name: 'TechCorp Solutions',
      code: 'TC001',
      logo: '🏢',
      companyType: 'public',
      companySize: 'enterprise',
      status: 'active',
      tier: 'vip',
      pipelineStage: 'active',
      rating: 5,
      ownerId: '1',
      teamIds: ['1', '2'],
      contacts: [
        {
          id: '1',
          name: 'Sarah Johnson',
          title: 'VP of Engineering',
          department: 'Engineering',
          email: 'sarah.johnson@techcorp.com',
          phone: '+1-555-0101',
          linkedin: 'linkedin.com/in/sarahjohnson',
          isPrimary: true,
          portalAccess: { enabled: true, username: 'sjohnson', lastLogin: now }
        },
        {
          id: '2',
          name: 'Michael Chen',
          title: 'HR Director',
          department: 'Human Resources',
          email: 'michael.chen@techcorp.com',
          phone: '+1-555-0102',
          isPrimary: false,
          portalAccess: { enabled: true, username: 'mchen' }
        }
      ],
      industry: ['Technology', 'Software'],
      regions: [
        { id: '1', name: 'San Francisco HQ', address: '123 Tech Street, San Francisco, CA 94105', isHQ: true },
        { id: '2', name: 'New York Office', address: '456 Innovation Ave, New York, NY 10001', isHQ: false }
      ],
      activeOpenings: 12,
      totalOpenings: 45,
      documents: [
        {
          id: '1',
          name: 'Master Service Agreement',
          type: 'msa',
          uploadedDate: '2024-01-15',
          uploadedBy: 'Admin',
          status: 'signed',
          signedDate: '2024-01-20'
        },
        {
          id: '2',
          name: 'NDA 2024',
          type: 'nda',
          uploadedDate: '2024-01-15',
          uploadedBy: 'Admin',
          status: 'signed',
          expiryDate: '2025-01-15'
        }
      ],
      complianceFields: {
        gdprCompliant: true,
        soc2Certified: true,
        references: 'ISO 27001 certified'
      },
      commissionRules: [
        {
          id: '1',
          name: 'Standard Commission',
          type: 'percentage',
          value: 20,
          startDate: '2024-01-01',
          appliesTo: 'All positions'
        }
      ],
      portalEnabled: true,
      portalSettings: {
        jobsVisible: ['1', '2', '3'],
        dashboardAccess: true,
        fileAccess: true
      },
      tags: ['Strategic Partner', 'High Volume', 'Tech'],
      sentimentTags: ['preferred', 'vip-treatment'],
      feedback: [
        {
          id: '1',
          comment: 'Excellent communication and quick turnaround times',
          rating: 5,
          createdBy: '1',
          createdDate: '2024-03-01'
        }
      ],
      lastContactDate: '2024-03-15',
      nextActionDate: '2024-04-01',
      nextActionType: 'Quarterly Review',
      createdAt: '2024-01-01',
      createdBy: '1',
      updatedAt: now,
      updatedBy: '1',
      notes: 'Premier client with long-term partnership'
    },
    {
      id: '2',
      name: 'HealthPlus Medical',
      code: 'HP002',
      logo: '🏥',
      companyType: 'private',
      companySize: 'large',
      status: 'active',
      tier: 'standard',
      pipelineStage: 'active',
      rating: 4,
      ownerId: '2',
      teamIds: ['1'],
      contacts: [
        {
          id: '3',
          name: 'Dr. Emily Brown',
          title: 'Chief Medical Officer',
          department: 'Medical',
          email: 'emily.brown@healthplus.com',
          phone: '+1-555-0201',
          isPrimary: true,
          portalAccess: { enabled: false }
        }
      ],
      industry: ['Healthcare', 'Medical Services'],
      regions: [
        { id: '3', name: 'Boston Medical Center', address: '789 Health Ave, Boston, MA 02115', isHQ: true }
      ],
      activeOpenings: 8,
      totalOpenings: 20,
      documents: [
        {
          id: '3',
          name: 'Service Agreement',
          type: 'msa',
          uploadedDate: '2024-02-01',
          uploadedBy: 'Admin',
          status: 'signed'
        }
      ],
      complianceFields: {
        gdprCompliant: true,
        soc2Certified: false,
        references: 'HIPAA compliant'
      },
      commissionRules: [
        {
          id: '2',
          name: 'Healthcare Standard',
          type: 'percentage',
          value: 18,
          startDate: '2024-02-01'
        }
      ],
      portalEnabled: false,
      tags: ['Healthcare', 'Compliance Heavy'],
      sentimentTags: ['reliable'],
      feedback: [],
      lastContactDate: '2024-03-10',
      createdAt: '2024-02-01',
      createdBy: '2',
      updatedAt: now,
      updatedBy: '2'
    },
    {
      id: '3',
      name: 'FinanceFirst Capital',
      code: 'FF003',
      logo: '💰',
      companyType: 'public',
      companySize: 'enterprise',
      status: 'active',
      tier: 'vip',
      pipelineStage: 'active',
      rating: 5,
      ownerId: '1',
      teamIds: ['2'],
      contacts: [
        {
          id: '4',
          name: 'Robert Williams',
          title: 'Managing Director',
          department: 'Investment Banking',
          email: 'r.williams@financefirst.com',
          phone: '+1-555-0301',
          isPrimary: true,
          portalAccess: { enabled: true, username: 'rwilliams', lastLogin: '2024-03-14' }
        }
      ],
      industry: ['Finance', 'Investment Banking'],
      regions: [
        { id: '4', name: 'Wall Street HQ', address: '100 Wall Street, New York, NY 10005', isHQ: true }
      ],
      activeOpenings: 15,
      totalOpenings: 30,
      documents: [
        {
          id: '4',
          name: 'Exclusive Partnership Agreement',
          type: 'msa',
          uploadedDate: '2024-01-10',
          uploadedBy: 'Admin',
          status: 'signed'
        },
        {
          id: '5',
          name: 'Commission Schedule Q1',
          type: 'commission',
          uploadedDate: '2024-01-10',
          uploadedBy: 'Admin',
          status: 'signed',
          expiryDate: '2024-04-01'
        }
      ],
      complianceFields: {
        gdprCompliant: true,
        soc2Certified: true,
        references: 'Series 7 licensed recruiters required'
      },
      commissionRules: [
        {
          id: '3',
          name: 'Executive Premium',
          type: 'percentage',
          value: 25,
          startDate: '2024-01-01',
          appliesTo: 'Executive roles'
        }
      ],
      portalEnabled: true,
      portalSettings: {
        jobsVisible: ['4', '5'],
        dashboardAccess: true,
        fileAccess: true
      },
      tags: ['Finance', 'VIP', 'Executive Search'],
      sentimentTags: ['preferred', 'high-priority'],
      feedback: [
        {
          id: '2',
          comment: 'Outstanding quality of candidates',
          rating: 5,
          createdBy: '1',
          createdDate: '2024-02-15'
        }
      ],
      lastContactDate: '2024-03-14',
      nextActionDate: '2024-04-05',
      nextActionType: 'Executive Review',
      createdAt: '2024-01-10',
      createdBy: '1',
      updatedAt: now,
      updatedBy: '1',
      notes: 'Requires executive-level attention for all placements'
    },
    {
      id: '4',
      name: 'RetailMax Inc',
      code: 'RM004',
      logo: '🛒',
      companyType: 'public',
      companySize: 'large',
      status: 'active',
      tier: 'standard',
      pipelineStage: 'active',
      rating: 3,
      ownerId: '3',
      teamIds: ['1'],
      contacts: [
        {
          id: '5',
          name: 'Lisa Martinez',
          title: 'Store Operations Manager',
          email: 'lisa.m@retailmax.com',
          phone: '+1-555-0401',
          isPrimary: true,
          portalAccess: { enabled: false }
        }
      ],
      industry: ['Retail', 'Consumer Goods'],
      regions: [
        { id: '5', name: 'Chicago Distribution Center', address: '500 Retail Blvd, Chicago, IL 60601', isHQ: true }
      ],
      activeOpenings: 25,
      totalOpenings: 50,
      documents: [],
      complianceFields: {},
      commissionRules: [
        {
          id: '4',
          name: 'Volume Discount',
          type: 'percentage',
          value: 15,
          startDate: '2024-02-01'
        }
      ],
      portalEnabled: false,
      tags: ['Retail', 'High Volume', 'Entry Level'],
      sentimentTags: [],
      feedback: [],
      lastContactDate: '2024-03-05',
      createdAt: '2024-02-01',
      createdBy: '3',
      updatedAt: now,
      updatedBy: '3'
    },
    {
      id: '5',
      name: 'StartupHub Ventures',
      code: 'SH005',
      logo: '🚀',
      companyType: 'startup',
      companySize: 'small',
      status: 'prospect',
      tier: 'standard',
      pipelineStage: 'qualified',
      rating: 0,
      ownerId: '2',
      teamIds: [],
      contacts: [
        {
          id: '6',
          name: 'Alex Thompson',
          title: 'CEO & Founder',
          email: 'alex@startuphub.io',
          phone: '+1-555-0501',
          isPrimary: true,
          portalAccess: { enabled: false }
        }
      ],
      industry: ['Technology', 'Startup'],
      regions: [
        { id: '6', name: 'Austin Office', address: '200 Startup Lane, Austin, TX 78701', isHQ: true }
      ],
      activeOpenings: 0,
      totalOpenings: 0,
      documents: [
        {
          id: '6',
          name: 'Initial Discussion NDA',
          type: 'nda',
          uploadedDate: '2024-03-01',
          uploadedBy: 'Admin',
          status: 'pending'
        }
      ],
      complianceFields: {},
      commissionRules: [],
      portalEnabled: false,
      tags: ['Startup', 'Prospect', 'Tech'],
      sentimentTags: [],
      feedback: [],
      lastContactDate: '2024-03-12',
      nextActionDate: '2024-03-25',
      nextActionType: 'Follow-up Call',
      createdAt: '2024-03-01',
      createdBy: '2',
      updatedAt: now,
      updatedBy: '2',
      notes: 'Interested in building engineering team. Follow up in two weeks.'
    },
    {
      id: '6',
      name: 'GreenEnergy Solutions',
      code: 'GE006',
      logo: '🌱',
      companyType: 'private',
      companySize: 'medium',
      status: 'inactive',
      tier: 'probation',
      pipelineStage: 'on-hold',
      rating: 2,
      ownerId: '1',
      teamIds: [],
      contacts: [
        {
          id: '7',
          name: 'Jennifer Green',
          title: 'HR Manager',
          email: 'j.green@greenenergy.com',
          isPrimary: true,
          portalAccess: { enabled: false }
        }
      ],
      industry: ['Energy', 'Sustainability'],
      regions: [
        { id: '7', name: 'Portland HQ', address: '300 Green Ave, Portland, OR 97201', isHQ: true }
      ],
      activeOpenings: 0,
      totalOpenings: 5,
      documents: [],
      complianceFields: {},
      commissionRules: [],
      portalEnabled: false,
      tags: ['Energy', 'On Hold'],
      sentimentTags: ['flagged'],
      feedback: [
        {
          id: '3',
          comment: 'Payment delays, need to monitor closely',
          rating: 2,
          createdBy: '1',
          createdDate: '2024-02-20'
        }
      ],
      lastContactDate: '2024-02-20',
      createdAt: '2024-01-15',
      createdBy: '1',
      updatedAt: now,
      updatedBy: '1',
      notes: 'On hold due to payment issues. Review in Q2.'
    },
    {
      id: '7',
      name: 'EduLearn Platform',
      code: 'EL007',
      logo: '📚',
      companyType: 'startup',
      companySize: 'small',
      status: 'active',
      tier: 'preferred',
      pipelineStage: 'active',
      rating: 4,
      ownerId: '2',
      teamIds: ['1'],
      contacts: [
        {
          id: '8',
          name: 'David Kim',
          title: 'Co-Founder',
          email: 'david@edulearn.com',
          phone: '+1-555-0701',
          isPrimary: true,
          portalAccess: { enabled: true, username: 'dkim' }
        }
      ],
      industry: ['Education', 'EdTech'],
      regions: [
        { id: '8', name: 'Seattle Office', address: '400 Learn Street, Seattle, WA 98101', isHQ: true }
      ],
      activeOpenings: 5,
      totalOpenings: 8,
      documents: [
        {
          id: '7',
          name: 'Partnership Agreement',
          type: 'msa',
          uploadedDate: '2024-02-10',
          uploadedBy: 'Admin',
          status: 'signed'
        }
      ],
      complianceFields: {
        gdprCompliant: true
      },
      commissionRules: [
        {
          id: '5',
          name: 'EdTech Special',
          type: 'percentage',
          value: 22,
          startDate: '2024-02-10'
        }
      ],
      portalEnabled: true,
      portalSettings: {
        jobsVisible: ['6'],
        dashboardAccess: true,
        fileAccess: false
      },
      tags: ['EdTech', 'Growing', 'Remote-First'],
      sentimentTags: ['preferred'],
      feedback: [],
      lastContactDate: '2024-03-13',
      createdAt: '2024-02-10',
      createdBy: '2',
      updatedAt: now,
      updatedBy: '2'
    },
    {
      id: '8',
      name: 'Manufacturing Pro',
      code: 'MP008',
      logo: '🏭',
      companyType: 'private',
      companySize: 'large',
      status: 'active',
      tier: 'standard',
      pipelineStage: 'active',
      rating: 4,
      ownerId: '3',
      teamIds: ['2'],
      contacts: [
        {
          id: '9',
          name: 'Tom Anderson',
          title: 'Plant Manager',
          email: 't.anderson@mfgpro.com',
          phone: '+1-555-0801',
          isPrimary: true,
          portalAccess: { enabled: false }
        }
      ],
      industry: ['Manufacturing', 'Industrial'],
      regions: [
        { id: '9', name: 'Detroit Plant', address: '600 Factory Road, Detroit, MI 48201', isHQ: true }
      ],
      activeOpenings: 18,
      totalOpenings: 35,
      documents: [
        {
          id: '8',
          name: 'Service Contract',
          type: 'msa',
          uploadedDate: '2024-01-20',
          uploadedBy: 'Admin',
          status: 'signed',
          expiryDate: '2025-01-20'
        }
      ],
      complianceFields: {},
      commissionRules: [
        {
          id: '6',
          name: 'Manufacturing Rate',
          type: 'percentage',
          value: 16,
          startDate: '2024-01-20'
        }
      ],
      portalEnabled: false,
      tags: ['Manufacturing', 'Skilled Labor'],
      sentimentTags: [],
      feedback: [],
      lastContactDate: '2024-03-08',
      createdAt: '2024-01-20',
      createdBy: '3',
      updatedAt: now,
      updatedBy: '3'
    },
    {
      id: '9',
      name: 'ConsultPro Partners',
      code: 'CP009',
      logo: '💼',
      companyType: 'private',
      companySize: 'medium',
      status: 'prospect',
      tier: 'standard',
      pipelineStage: 'negotiation',
      rating: 0,
      ownerId: '1',
      teamIds: [],
      contacts: [
        {
          id: '10',
          name: 'Patricia Lee',
          title: 'Partner',
          email: 'patricia@consultpro.com',
          phone: '+1-555-0901',
          isPrimary: true,
          portalAccess: { enabled: false }
        }
      ],
      industry: ['Consulting', 'Professional Services'],
      regions: [
        { id: '10', name: 'Miami Office', address: '700 Consult Ave, Miami, FL 33101', isHQ: true }
      ],
      activeOpenings: 0,
      totalOpenings: 0,
      documents: [
        {
          id: '9',
          name: 'Draft Agreement',
          type: 'msa',
          uploadedDate: '2024-03-10',
          uploadedBy: 'Admin',
          status: 'draft'
        }
      ],
      complianceFields: {},
      commissionRules: [],
      portalEnabled: false,
      tags: ['Consulting', 'Negotiation'],
      sentimentTags: [],
      feedback: [],
      lastContactDate: '2024-03-14',
      nextActionDate: '2024-03-20',
      nextActionType: 'Contract Review',
      createdAt: '2024-03-10',
      createdBy: '1',
      updatedAt: now,
      updatedBy: '1',
      notes: 'Finalizing contract terms. Expected to close by end of month.'
    },
    {
      id: '10',
      name: 'MediaWorks Agency',
      code: 'MW010',
      logo: '🎬',
      companyType: 'private',
      companySize: 'medium',
      status: 'archived',
      tier: 'standard',
      pipelineStage: 'archived',
      rating: 3,
      ownerId: '2',
      teamIds: [],
      contacts: [
        {
          id: '11',
          name: 'Rachel Smith',
          title: 'Creative Director',
          email: 'rachel@mediaworks.com',
          isPrimary: true,
          portalAccess: { enabled: false }
        }
      ],
      industry: ['Media', 'Marketing'],
      regions: [
        { id: '11', name: 'Los Angeles Studio', address: '800 Media Blvd, Los Angeles, CA 90001', isHQ: true }
      ],
      activeOpenings: 0,
      totalOpenings: 10,
      documents: [],
      complianceFields: {},
      commissionRules: [],
      portalEnabled: false,
      tags: ['Media', 'Archived'],
      sentimentTags: [],
      feedback: [],
      lastContactDate: '2023-12-15',
      createdAt: '2023-06-01',
      createdBy: '2',
      updatedAt: '2024-01-15',
      updatedBy: '2',
      notes: 'Contract ended. No longer active.'
    }
  ];
};

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(() => {
    const stored = localStorage.getItem('smoothire_clients');
    return stored ? JSON.parse(stored) : generateMockClients();
  });

  useEffect(() => {
    localStorage.setItem('smoothire_clients', JSON.stringify(clients));
  }, [clients]);

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev =>
      prev.map(client =>
        client.id === id
          ? { ...client, ...updates, updatedAt: new Date().toISOString() }
          : client
      )
    );
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  const archiveClient = (id: string) => {
    updateClient(id, { status: 'archived', pipelineStage: 'archived' });
  };

  const bulkUpdateClients = (ids: string[], updates: Partial<Client>) => {
    setClients(prev =>
      prev.map(client =>
        ids.includes(client.id)
          ? { ...client, ...updates, updatedAt: new Date().toISOString() }
          : client
      )
    );
  };

  const bulkDeleteClients = (ids: string[]) => {
    setClients(prev => prev.filter(client => !ids.includes(client.id)));
  };

  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  const getClientsByOwner = (ownerId: string) => {
    return clients.filter(client => client.ownerId === ownerId);
  };

  const getClientsByTeam = (teamId: string) => {
    return clients.filter(client => client.teamIds.includes(teamId));
  };

  const addContact = (clientId: string, contactData: Omit<ClientContact, 'id'>) => {
    const client = getClientById(clientId);
    if (!client) return;

    const newContact: ClientContact = {
      ...contactData,
      id: String(Date.now()),
    };

    updateClient(clientId, {
      contacts: [...client.contacts, newContact],
    });
  };

  const updateContact = (clientId: string, contactId: string, updates: Partial<ClientContact>) => {
    const client = getClientById(clientId);
    if (!client) return;

    updateClient(clientId, {
      contacts: client.contacts.map(contact =>
        contact.id === contactId ? { ...contact, ...updates } : contact
      ),
    });
  };

  const deleteContact = (clientId: string, contactId: string) => {
    const client = getClientById(clientId);
    if (!client) return;

    updateClient(clientId, {
      contacts: client.contacts.filter(contact => contact.id !== contactId),
    });
  };

  const addDocument = (clientId: string, documentData: Omit<ClientDocument, 'id'>) => {
    const client = getClientById(clientId);
    if (!client) return;

    const newDocument: ClientDocument = {
      ...documentData,
      id: String(Date.now()),
    };

    updateClient(clientId, {
      documents: [...client.documents, newDocument],
    });
  };

  const updateDocument = (clientId: string, docId: string, updates: Partial<ClientDocument>) => {
    const client = getClientById(clientId);
    if (!client) return;

    updateClient(clientId, {
      documents: client.documents.map(doc =>
        doc.id === docId ? { ...doc, ...updates } : doc
      ),
    });
  };

  const deleteDocument = (clientId: string, docId: string) => {
    const client = getClientById(clientId);
    if (!client) return;

    updateClient(clientId, {
      documents: client.documents.filter(doc => doc.id !== docId),
    });
  };

  const addCommissionRule = (clientId: string, ruleData: Omit<CommissionRule, 'id'>) => {
    const client = getClientById(clientId);
    if (!client) return;

    const newRule: CommissionRule = {
      ...ruleData,
      id: String(Date.now()),
    };

    updateClient(clientId, {
      commissionRules: [...client.commissionRules, newRule],
    });
  };

  const updateCommissionRule = (clientId: string, ruleId: string, updates: Partial<CommissionRule>) => {
    const client = getClientById(clientId);
    if (!client) return;

    updateClient(clientId, {
      commissionRules: client.commissionRules.map(rule =>
        rule.id === ruleId ? { ...rule, ...updates } : rule
      ),
    });
  };

  const addFeedback = (clientId: string, feedbackData: Omit<ClientFeedback, 'id'>) => {
    const client = getClientById(clientId);
    if (!client) return;

    const newFeedback: ClientFeedback = {
      ...feedbackData,
      id: String(Date.now()),
    };

    updateClient(clientId, {
      feedback: [...client.feedback, newFeedback],
    });
  };

  return (
    <ClientsContext.Provider
      value={{
        clients,
        addClient,
        updateClient,
        deleteClient,
        archiveClient,
        bulkUpdateClients,
        bulkDeleteClients,
        getClientById,
        getClientsByOwner,
        getClientsByTeam,
        addContact,
        updateContact,
        deleteContact,
        addDocument,
        updateDocument,
        deleteDocument,
        addCommissionRule,
        updateCommissionRule,
        addFeedback,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};
