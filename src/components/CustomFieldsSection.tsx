import React from 'react';
import { CustomField, CustomFieldsData, ModuleType } from '@/types/customField';
import { useCustomFields } from '@/contexts/CustomFieldsContext';
import { CustomFieldRenderer } from './CustomFieldRenderer';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

interface CustomFieldsSectionProps {
  module: ModuleType;
  values: CustomFieldsData;
  onChange: (values: CustomFieldsData) => void;
  disabled?: boolean;
}

export const CustomFieldsSection: React.FC<CustomFieldsSectionProps> = ({
  module,
  values,
  onChange,
  disabled = false,
}) => {
  const { getFieldsByModule } = useCustomFields();
  const fields = getFieldsByModule(module);

  if (fields.length === 0) {
    return null;
  }

  // Group fields by category
  const groupedFields = fields.reduce((acc, field) => {
    const category = field.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(field);
    return acc;
  }, {} as Record<string, CustomField[]>);

  const handleFieldChange = (fieldId: string, value: any) => {
    onChange({
      ...values,
      [fieldId]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Custom Fields</h3>
        <p className="text-sm text-muted-foreground">
          Additional information specific to your organization
        </p>
      </div>

      {Object.entries(groupedFields).map(([category, categoryFields], index) => (
        <div key={category}>
          {index > 0 && <Separator className="my-6" />}
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {category}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryFields.map((field) => (
                <div
                  key={field.id}
                  className={field.fieldType === 'multiselect' ? 'md:col-span-2' : ''}
                >
                  <CustomFieldRenderer
                    field={field}
                    value={values[field.id]}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    allValues={values}
                    disabled={disabled}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
