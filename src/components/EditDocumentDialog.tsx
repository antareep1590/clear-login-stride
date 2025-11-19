import { useState, useEffect } from 'react';
import { ClientDocument, DocumentType, DocumentStatus } from '@/types/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EditDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: ClientDocument;
  onUpdate: (updates: Partial<ClientDocument>) => void;
}

export function EditDocumentDialog({ open, onOpenChange, document, onUpdate }: EditDocumentDialogProps) {
  const [name, setName] = useState(document.name);
  const [type, setType] = useState<DocumentType>(document.type);
  const [status, setStatus] = useState<DocumentStatus>(document.status);
  const [expiryDate, setExpiryDate] = useState(document.expiryDate || '');
  const [signedBy, setSignedBy] = useState(document.signedBy || '');
  const [signedDate, setSignedDate] = useState(document.signedDate || '');

  useEffect(() => {
    setName(document.name);
    setType(document.type);
    setStatus(document.status);
    setExpiryDate(document.expiryDate || '');
    setSignedBy(document.signedBy || '');
    setSignedDate(document.signedDate || '');
  }, [document]);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a document name',
        variant: 'destructive',
      });
      return;
    }

    onUpdate({
      name: name.trim(),
      type,
      status,
      expiryDate: expiryDate || undefined,
      signedBy: signedBy.trim() || undefined,
      signedDate: signedDate || undefined,
    });

    toast({
      title: 'Success',
      description: 'Document updated successfully',
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
          <DialogDescription>
            Update the document details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Document Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Master Service Agreement"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Document Type *</Label>
            <Select value={type} onValueChange={(value) => setType(value as DocumentType)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="msa">MSA (Master Service Agreement)</SelectItem>
                <SelectItem value="nda">NDA (Non-Disclosure Agreement)</SelectItem>
                <SelectItem value="commission">Commission Agreement</SelectItem>
                <SelectItem value="compliance">Compliance Document</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as DocumentStatus)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending Signature</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status === 'signed' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="signedBy">Signed By</Label>
                <Input
                  id="signedBy"
                  value={signedBy}
                  onChange={(e) => setSignedBy(e.target.value)}
                  placeholder="e.g., John Doe"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="signedDate">Signed Date</Label>
                <Input
                  id="signedDate"
                  type="date"
                  value={signedDate}
                  onChange={(e) => setSignedDate(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="grid gap-2">
            <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
            <Input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
