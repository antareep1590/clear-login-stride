import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CommissionRule } from '@/types/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AddCommissionRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (rule: Omit<CommissionRule, 'id'>) => void;
}

export function AddCommissionRuleDialog({ open, onOpenChange, onAdd }: AddCommissionRuleDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    appliesTo: '',
    notes: '',
    documentId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a rule name',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.value || parseFloat(formData.value) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid commission value',
        variant: 'destructive',
      });
      return;
    }

    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      toast({
        title: 'Validation Error',
        description: 'End date must be after start date',
        variant: 'destructive',
      });
      return;
    }

    const ruleData: Omit<CommissionRule, 'id'> = {
      name: formData.name.trim(),
      type: formData.type,
      value: parseFloat(formData.value),
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      appliesTo: formData.appliesTo.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      documentId: formData.documentId.trim() || undefined,
    };

    onAdd(ruleData);
    
    // Reset form
    setFormData({
      name: '',
      type: 'percentage',
      value: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: '',
      appliesTo: '',
      notes: '',
      documentId: '',
    });
    
    onOpenChange(false);
    
    toast({
      title: 'Success',
      description: 'Commission rule added successfully',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Commission Rule</DialogTitle>
          <DialogDescription>
            Create a new commission rule with specific terms and validity period
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Rule Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Standard Commission"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'percentage' | 'fixed') =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">
              Commission Value * ({formData.type === 'percentage' ? '%' : '$'})
            </Label>
            <Input
              id="value"
              type="number"
              step={formData.type === 'percentage' ? '0.01' : '1'}
              min="0"
              max={formData.type === 'percentage' ? '100' : undefined}
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder={formData.type === 'percentage' ? '15' : '5000'}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appliesTo">Applies To (Optional)</Label>
            <Input
              id="appliesTo"
              value={formData.appliesTo}
              onChange={(e) => setFormData({ ...formData, appliesTo: e.target.value })}
              placeholder="e.g., All placements, Senior roles only"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentId">Linked Document ID (Optional)</Label>
            <Input
              id="documentId"
              value={formData.documentId}
              onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
              placeholder="Reference to related commission agreement document"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional details or conditions about this commission rule..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Commission Rule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
