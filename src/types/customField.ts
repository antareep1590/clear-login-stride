export type FieldType = 
  | 'text' 
  | 'number' 
  | 'date' 
  | 'email' 
  | 'phone' 
  | 'dropdown' 
  | 'multiselect' 
  | 'checkbox' 
  | 'file' 
  | 'url' 
  | 'formula' 
  | 'reference' 
  | 'conditional';

export type ModuleType = 'clients' | 'employees' | 'candidates' | 'jobs';

export type FieldPermission = {
  role: string[];
  canView: boolean;
  canEdit: boolean;
};

export type ConditionalRule = {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  value: any;
};

export interface CustomField {
  id: string;
  name: string;
  fieldType: FieldType;
  modules: ModuleType[];
  category?: string;
  required: boolean;
  readOnly: boolean;
  order: number;
  
  // For dropdown/multiselect
  options?: string[];
  
  // For conditional fields
  conditionalRules?: ConditionalRule[];
  
  // Permissions
  permissions?: FieldPermission[];
  
  // Default value
  defaultValue?: any;
  
  // Formula for calculated fields
  formula?: string;
  
  // Metadata
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CustomFieldValue {
  fieldId: string;
  value: any;
  updatedAt: string;
  updatedBy: string;
}

export type CustomFieldsData = Record<string, any>;
