import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomField, ModuleType } from '@/types/customField';

interface CustomFieldsContextType {
  fields: CustomField[];
  getFieldsByModule: (module: ModuleType) => CustomField[];
  addField: (field: Omit<CustomField, 'id' | 'createdAt' | 'order'>) => void;
  updateField: (id: string, updates: Partial<CustomField>) => void;
  deleteField: (id: string) => void;
  reorderFields: (fieldIds: string[]) => void;
}

const CustomFieldsContext = createContext<CustomFieldsContextType | undefined>(undefined);

export const useCustomFields = () => {
  const context = useContext(CustomFieldsContext);
  if (!context) {
    throw new Error('useCustomFields must be used within CustomFieldsProvider');
  }
  return context;
};

const STORAGE_KEY = 'smoothire_custom_fields';

const mockFields: CustomField[] = [
  {
    id: 'cf_1',
    name: 'Industry Specialization',
    fieldType: 'multiselect',
    modules: ['clients'],
    category: 'Details',
    required: false,
    readOnly: false,
    order: 0,
    options: ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 'Education'],
    createdAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    id: 'cf_2',
    name: 'Contract Type',
    fieldType: 'dropdown',
    modules: ['clients'],
    category: 'Compliance',
    required: true,
    readOnly: false,
    order: 1,
    options: ['MSA', 'SOW', 'Fixed Term', 'Retainer'],
    createdAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    id: 'cf_3',
    name: 'Client Portal Access',
    fieldType: 'checkbox',
    modules: ['clients'],
    category: 'Settings',
    required: false,
    readOnly: false,
    order: 2,
    defaultValue: false,
    createdAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    id: 'cf_4',
    name: 'LinkedIn Profile',
    fieldType: 'url',
    modules: ['employees'],
    category: 'Social',
    required: false,
    readOnly: false,
    order: 3,
    createdAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    id: 'cf_5',
    name: 'Certification Expiry',
    fieldType: 'date',
    modules: ['employees'],
    category: 'Compliance',
    required: false,
    readOnly: false,
    order: 4,
    createdAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    id: 'cf_6',
    name: 'Emergency Contact',
    fieldType: 'phone',
    modules: ['employees'],
    category: 'Personal',
    required: true,
    readOnly: false,
    order: 5,
    createdAt: new Date().toISOString(),
    createdBy: 'system',
  },
];

export const CustomFieldsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fields, setFields] = useState<CustomField[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFields(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse custom fields:', error);
        setFields(mockFields);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockFields));
      }
    } else {
      setFields(mockFields);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockFields));
    }
  }, []);

  const saveFields = (newFields: CustomField[]) => {
    setFields(newFields);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFields));
  };

  const getFieldsByModule = (module: ModuleType): CustomField[] => {
    return fields
      .filter(field => field.modules.includes(module))
      .sort((a, b) => a.order - b.order);
  };

  const addField = (fieldData: Omit<CustomField, 'id' | 'createdAt' | 'order'>) => {
    const newField: CustomField = {
      ...fieldData,
      id: `cf_${Date.now()}`,
      order: fields.length,
      createdAt: new Date().toISOString(),
    };
    saveFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<CustomField>) => {
    const updatedFields = fields.map(field =>
      field.id === id
        ? { ...field, ...updates, updatedAt: new Date().toISOString() }
        : field
    );
    saveFields(updatedFields);
  };

  const deleteField = (id: string) => {
    saveFields(fields.filter(field => field.id !== id));
  };

  const reorderFields = (fieldIds: string[]) => {
    const reordered = fieldIds.map((id, index) => {
      const field = fields.find(f => f.id === id);
      return field ? { ...field, order: index } : null;
    }).filter(Boolean) as CustomField[];
    
    saveFields(reordered);
  };

  return (
    <CustomFieldsContext.Provider
      value={{
        fields,
        getFieldsByModule,
        addField,
        updateField,
        deleteField,
        reorderFields,
      }}
    >
      {children}
    </CustomFieldsContext.Provider>
  );
};
