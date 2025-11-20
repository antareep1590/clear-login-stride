import React from 'react';
import { CustomField, CustomFieldsData } from '@/types/customField';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CustomFieldRendererProps {
  field: CustomField;
  value: any;
  onChange: (value: any) => void;
  allValues?: CustomFieldsData;
  disabled?: boolean;
}

export const CustomFieldRenderer: React.FC<CustomFieldRendererProps> = ({
  field,
  value,
  onChange,
  allValues = {},
  disabled = false,
}) => {
  const isDisabled = disabled || field.readOnly;

  // Check conditional rules
  const shouldShow = React.useMemo(() => {
    if (!field.conditionalRules || field.conditionalRules.length === 0) {
      return true;
    }

    return field.conditionalRules.every(rule => {
      const dependentValue = allValues[rule.fieldId];
      switch (rule.operator) {
        case 'equals':
          return dependentValue === rule.value;
        case 'notEquals':
          return dependentValue !== rule.value;
        case 'contains':
          return String(dependentValue).includes(rule.value);
        case 'greaterThan':
          return Number(dependentValue) > Number(rule.value);
        case 'lessThan':
          return Number(dependentValue) < Number(rule.value);
        default:
          return true;
      }
    });
  }, [field.conditionalRules, allValues]);

  if (!shouldShow) {
    return null;
  }

  const renderField = () => {
    switch (field.fieldType) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
            disabled={isDisabled}
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );

      case 'phone':
        return (
          <Input
            type="tel"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );

      case 'url':
        return (
          <Input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
            placeholder="https://example.com"
          />
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !value && 'text-muted-foreground'
                )}
                disabled={isDisabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => onChange(date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value || false}
              onCheckedChange={onChange}
              disabled={isDisabled}
            />
            <Label className="text-sm font-normal">
              {field.name}
            </Label>
          </div>
        );

      case 'dropdown':
        return (
          <Select value={value || ''} onValueChange={onChange} disabled={isDisabled}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...selectedValues, option]);
                    } else {
                      onChange(selectedValues.filter((v: string) => v !== option));
                    }
                  }}
                  disabled={isDisabled}
                />
                <Label className="text-sm font-normal">{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isDisabled}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      onChange({ name: file.name, size: file.size, type: file.type });
                    }
                  };
                  input.click();
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
              {value && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{value.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onChange(null)}
                    disabled={isDisabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 'formula':
        return (
          <Input
            value={value || 'Calculated...'}
            disabled={true}
            className="bg-muted"
          />
        );

      case 'reference':
      case 'conditional':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
            placeholder={`Select ${field.name.toLowerCase()}`}
          />
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
          />
        );
    }
  };

  // Checkbox fields render their own label
  if (field.fieldType === 'checkbox') {
    return (
      <div className="space-y-2">
        {renderField()}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>
        {field.name}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderField()}
    </div>
  );
};
