export type ClientStatus = 'active' | 'inactive' | 'archived' | 'prospect' | 'onboarding';
export type ClientTier = 'vip' | 'standard' | 'probation' | 'preferred';
export type PipelineStage = 'prospect' | 'qualified' | 'negotiation' | 'active' | 'on-hold' | 'archived';
export type DocumentType = 'msa' | 'nda' | 'commission' | 'compliance' | 'other';
export type DocumentStatus = 'signed' | 'pending' | 'expired' | 'draft';

export interface ClientContact {
  id: string;
  name: string;
  title: string;
  department?: string;
  role?: string;
  email: string;
  phone?: string;
  linkedin?: string;
  isPrimary: boolean;
  notes?: string;
  portalAccess?: {
    enabled: boolean;
    username?: string;
    lastLogin?: string;
    invitationSent?: string;
  };
}

export interface ClientDocument {
  id: string;
  name: string;
  type: DocumentType;
  url?: string;
  uploadedDate: string;
  uploadedBy: string;
  status: DocumentStatus;
  expiryDate?: string;
  signedBy?: string;
  signedDate?: string;
}

export interface CommissionRule {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate: string;
  endDate?: string;
  appliesTo?: string;
  notes?: string;
  documentId?: string;
}

export interface ClientLocation {
  id: string;
  name: string;
  address: string;
  isHQ: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ClientFeedback {
  id: string;
  comment: string;
  rating: number;
  createdBy: string;
  createdDate: string;
}

export interface ClientNote {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
  isPinned: boolean;
  tags?: string[];
  category?: string;
}

export interface Client {
  id: string;
  // Basic Info
  name: string;
  code: string;
  logo?: string;
  companyType: 'public' | 'private' | 'startup' | 'nonprofit';
  companySize: 'small' | 'medium' | 'large' | 'enterprise';
  
  // Status & Classification
  status: ClientStatus;
  tier: ClientTier;
  pipelineStage: PipelineStage;
  rating: number;
  
  // Ownership & Assignment
  ownerId: string;
  teamIds: string[];
  
  // Contacts
  contacts: ClientContact[];
  
  // Location & Industry
  industry: string[];
  regions: ClientLocation[];
  
  // Jobs & Openings
  activeOpenings: number;
  totalOpenings: number;
  
  // Documents & Compliance
  documents: ClientDocument[];
  complianceFields?: {
    gdprCompliant?: boolean;
    soc2Certified?: boolean;
    references?: string;
    customFields?: Record<string, any>;
  };
  
  // Commission & Pricing
  commissionRules: CommissionRule[];
  
  // Portal
  portalEnabled: boolean;
  portalSettings?: {
    jobsVisible: string[];
    dashboardAccess: boolean;
    fileAccess: boolean;
  };
  
  // Tags & Categories
  tags: string[];
  
  // Feedback & Sentiment
  sentimentTags: string[];
  feedback: ClientFeedback[];
  
  // Activity
  lastContactDate?: string;
  nextActionDate?: string;
  nextActionType?: string;
  
  // Metadata
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  notes: ClientNote[];
}
