import { useState } from 'react';
import { Integration } from '@/types/integration';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface IntegrationSettingsDialogProps {
  integration: Integration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: any) => void;
}

export function IntegrationSettingsDialog({
  integration,
  open,
  onOpenChange,
  onSave,
}: IntegrationSettingsDialogProps) {
  const [syncFrequency, setSyncFrequency] = useState(
    integration?.settings?.syncFrequency || 'hourly'
  );
  const [notifications, setNotifications] = useState(
    integration?.settings?.notifications ?? true
  );
  const [apiKey, setApiKey] = useState(integration?.settings?.apiKey || '');

  const handleSave = () => {
    onSave({
      syncFrequency,
      notifications,
      apiKey: apiKey || undefined,
    });
    onOpenChange(false);
  };

  if (!integration) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Integration Settings: {integration.name}</DialogTitle>
          <DialogDescription>
            Configure sync frequency, notifications, and other settings for this integration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="sync-frequency">Sync Frequency</Label>
            <Select value={syncFrequency} onValueChange={(value) => setSyncFrequency(value as 'realtime' | 'hourly' | 'daily' | 'weekly')}>
              <SelectTrigger id="sync-frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about sync status and errors
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key (Optional)</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter API key if required"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Some integrations require an API key for additional features
            </p>
          </div>

          <div className="space-y-2">
            <Label>Account Mapping</Label>
            <p className="text-sm text-muted-foreground">
              Current owner: {integration.owner || 'Not assigned'}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
