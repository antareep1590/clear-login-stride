import { useState } from 'react';
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
import { Upload, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AddDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (document: Omit<ClientDocument, 'id' | 'uploadedDate' | 'uploadedBy'>) => void;
}

export function AddDocumentDialog({ open, onOpenChange, onAdd }: AddDocumentDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<DocumentType>('other');
  const [status, setStatus] = useState<DocumentStatus>('draft');
  const [file, setFile] = useState<File | null>(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [signedBy, setSignedBy] = useState('');
  const [signedDate, setSignedDate] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: 'Error',
          description: 'File size must be less than 10MB',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name);
      }
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a document name',
        variant: 'destructive',
      });
      return;
    }

    let fileUrl: string | undefined;
    if (file) {
      // Convert file to base64 data URL for local storage
      const reader = new FileReader();
      fileUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    onAdd({
      name: name.trim(),
      type,
      status,
      url: fileUrl,
      expiryDate: expiryDate || undefined,
      signedBy: signedBy.trim() || undefined,
      signedDate: signedDate || undefined,
    });

    toast({
      title: 'Success',
      description: 'Document added successfully',
    });

    // Reset form
    setName('');
    setType('other');
    setStatus('draft');
    setFile(null);
    setExpiryDate('');
    setSignedBy('');
    setSignedDate('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Document</DialogTitle>
          <DialogDescription>
            Upload a new document to this client's profile.
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

          <div className="grid gap-2">
            <Label htmlFor="file">Upload File (Optional, max 10MB)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="cursor-pointer"
              />
              {file && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
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
            <Upload className="mr-2 h-4 w-4" />
            Add Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
