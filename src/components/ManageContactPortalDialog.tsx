import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ClientContact } from '@/types/client';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

interface ManageContactPortalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: ClientContact | null;
  onUpdate: (contactId: string, updates: Partial<ClientContact>) => void;
}

export function ManageContactPortalDialog({ 
  open, 
  onOpenChange, 
  contact,
  onUpdate 
}: ManageContactPortalDialogProps) {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (open && contact) {
      setEnabled(contact.portalAccess?.enabled || false);
      setUsername(contact.portalAccess?.username || contact.email.split('@')[0]);
    }
  }, [open, contact]);

  if (!contact) return null;

  const handleSave = () => {
    onUpdate(contact.id, {
      portalAccess: {
        enabled,
        username: enabled ? username : undefined,
        lastLogin: contact.portalAccess?.lastLogin,
        invitationSent: enabled && !contact.portalAccess?.invitationSent 
          ? new Date().toISOString()
          : contact.portalAccess?.invitationSent,
      }
    });

    toast({
      title: enabled ? 'Portal access granted' : 'Portal access revoked',
      description: enabled 
        ? `${contact.name} can now access the client portal.`
        : `${contact.name} no longer has portal access.`,
    });

    onOpenChange(false);
  };

  const handleSendInvitation = () => {
    onUpdate(contact.id, {
      portalAccess: {
        ...contact.portalAccess,
        enabled,
        username,
        invitationSent: new Date().toISOString(),
      }
    });

    toast({
      title: 'Invitation sent',
      description: `Portal invitation email sent to ${contact.email}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Portal Access</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Contact Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="font-medium text-foreground">{contact.name}</p>
            <p className="text-sm text-muted-foreground">{contact.email}</p>
            {contact.title && (
              <p className="text-sm text-muted-foreground">{contact.title}</p>
            )}
          </div>

          {/* Enable/Disable Portal */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="portal-enabled" className="text-base font-medium">
                Portal Access
              </Label>
              <p className="text-sm text-muted-foreground">
                {enabled ? 'Contact can access the portal' : 'Contact cannot access the portal'}
              </p>
            </div>
            <Switch 
              id="portal-enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          {/* Username */}
          {enabled && (
            <div className="space-y-2">
              <Label htmlFor="username">Portal Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
              <p className="text-xs text-muted-foreground">
                This username will be used for portal login
              </p>
            </div>
          )}

          {/* Invitation Status */}
          {enabled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Invitation Status</Label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSendInvitation}
                  className="gap-2"
                >
                  <Send className="h-3 w-3" />
                  {contact.portalAccess?.invitationSent ? 'Resend' : 'Send'} Invitation
                </Button>
              </div>
              {contact.portalAccess?.invitationSent && (
                <p className="text-sm text-muted-foreground">
                  Invitation sent on {new Date(contact.portalAccess.invitationSent).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
