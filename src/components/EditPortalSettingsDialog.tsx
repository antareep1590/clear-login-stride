import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Client } from '@/types/client';
import { useToast } from '@/hooks/use-toast';

interface EditPortalSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
  onUpdate: (clientId: string, updates: Partial<Client>) => void;
}

export function EditPortalSettingsDialog({ 
  open, 
  onOpenChange, 
  client,
  onUpdate 
}: EditPortalSettingsDialogProps) {
  const { toast } = useToast();
  const [dashboardAccess, setDashboardAccess] = useState(false);
  const [fileAccess, setFileAccess] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  useEffect(() => {
    if (open && client.portalSettings) {
      setDashboardAccess(client.portalSettings.dashboardAccess || false);
      setFileAccess(client.portalSettings.fileAccess || false);
      setSelectedJobs(client.portalSettings.jobsVisible || []);
    }
  }, [open, client]);

  const handleSave = () => {
    onUpdate(client.id, {
      portalSettings: {
        dashboardAccess,
        fileAccess,
        jobsVisible: selectedJobs,
      }
    });

    toast({
      title: 'Portal settings updated',
      description: 'The client portal settings have been saved successfully.',
    });

    onOpenChange(false);
  };

  const handleJobToggle = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Portal Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Dashboard Access */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="dashboard-access" className="text-base font-medium">
                Dashboard Access
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow contacts to view analytics and insights dashboard
              </p>
            </div>
            <Switch 
              id="dashboard-access"
              checked={dashboardAccess}
              onCheckedChange={setDashboardAccess}
            />
          </div>

          {/* File Access */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="file-access" className="text-base font-medium">
                File Access
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow contacts to view and download documents
              </p>
            </div>
            <Switch 
              id="file-access"
              checked={fileAccess}
              onCheckedChange={setFileAccess}
            />
          </div>

          {/* Job Visibility */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Visible Jobs</Label>
            <p className="text-sm text-muted-foreground">
              Select which job postings are visible to portal users
            </p>
            
            {client.jobs.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground border border-border rounded-lg">
                No jobs available for this client
              </div>
            ) : (
              <div className="space-y-2 border border-border rounded-lg p-4 max-h-60 overflow-y-auto">
                {client.jobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded"
                  >
                    <Checkbox 
                      id={`job-${job.id}`}
                      checked={selectedJobs.includes(job.id)}
                      onCheckedChange={() => handleJobToggle(job.id)}
                    />
                    <label 
                      htmlFor={`job-${job.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <p className="font-medium text-foreground">{job.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.department} • {job.location} • {job.status}
                      </p>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
