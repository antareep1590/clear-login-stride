import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Client } from '@/types/client';

interface EditComplianceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  complianceFields?: Client['complianceFields'];
  onUpdate: (clientId: string, updates: { complianceFields: Client['complianceFields'] }) => void;
}

export function EditComplianceDialog({
  open,
  onOpenChange,
  clientId,
  complianceFields,
  onUpdate,
}: EditComplianceDialogProps) {
  const [gdprCompliant, setGdprCompliant] = useState(complianceFields?.gdprCompliant || false);
  const [soc2Certified, setSoc2Certified] = useState(complianceFields?.soc2Certified || false);
  const [references, setReferences] = useState(complianceFields?.references || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onUpdate(clientId, {
      complianceFields: {
        gdprCompliant,
        soc2Certified,
        references: references.trim() || undefined,
        customFields: complianceFields?.customFields,
      },
    });

    toast({
      title: 'Success',
      description: 'Compliance information updated successfully',
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Compliance Information</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="gdprCompliant"
                checked={gdprCompliant}
                onCheckedChange={(checked) => setGdprCompliant(checked as boolean)}
              />
              <Label
                htmlFor="gdprCompliant"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                GDPR Compliant
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="soc2Certified"
                checked={soc2Certified}
                onCheckedChange={(checked) => setSoc2Certified(checked as boolean)}
              />
              <Label
                htmlFor="soc2Certified"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                SOC2 Certified
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="references">References</Label>
              <Textarea
                id="references"
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                placeholder="Enter compliance references or notes..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
