import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIntegrations } from '@/contexts/IntegrationsContext';
import { Integration, IntegrationCategory, IntegrationCategoryInfo } from '@/types/integration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { IntegrationCard } from '@/components/IntegrationCard';
import { IntegrationSettingsDialog } from '@/components/IntegrationSettingsDialog';
import { UnipleSocialIntegration } from '@/components/UnipleSocialIntegration';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Mail, Share2, Zap, Users, Briefcase, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const categoryIcons = {
  email_campaigns: Mail,
  social_integration: Share2,
  automation_tools: Zap,
  crm_integrations: Users,
  job_boards: Briefcase,
};

const categoryLabels = {
  email_campaigns: 'Email Campaigns',
  social_integration: 'Social Integration',
  automation_tools: 'Automation Tools',
  crm_integrations: 'CRM Integrations',
  job_boards: 'Job Boards',
};

const categoryDescriptions = {
  email_campaigns: 'Manage email marketing platforms and campaigns',
  social_integration: 'Connect and sync with social media platforms',
  automation_tools: 'Automate workflows with integration platforms',
  crm_integrations: 'Sync customer data with CRM systems',
  job_boards: 'Post and manage jobs across multiple boards',
};

const ConnectionHub = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    integrations,
    connectIntegration,
    disconnectIntegration,
    syncIntegration,
    updateIntegrationSettings,
  } = useIntegrations();

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [integrationToDisconnect, setIntegrationToDisconnect] = useState<string | null>(null);

  // Calculate category info
  const categoryInfo = useMemo(() => {
    const categories: IntegrationCategoryInfo[] = [];
    const categoryIds: IntegrationCategory[] = [
      'email_campaigns',
      'social_integration',
      'automation_tools',
      'crm_integrations',
      'job_boards',
    ];

    categoryIds.forEach((categoryId) => {
      const categoryIntegrations = integrations.filter((i) => i.category === categoryId);
      const connectedCount = categoryIntegrations.filter((i) => i.status === 'connected').length;
      const hasErrors = categoryIntegrations.some(
        (i) => i.status === 'error' || i.status === 'expired'
      );
      const lastSyncDates = categoryIntegrations
        .filter((i) => i.status === 'connected')
        .map((i) => new Date(i.lastSync));
      const lastSync =
        lastSyncDates.length > 0
          ? new Date(Math.max(...lastSyncDates.map((d) => d.getTime()))).toISOString()
          : undefined;

      categories.push({
        id: categoryId,
        name: categoryLabels[categoryId],
        icon: categoryIcons[categoryId].name,
        description: categoryDescriptions[categoryId],
        connectedCount,
        totalAvailable: categoryIntegrations.length,
        lastSync,
        hasErrors,
      });
    });

    return categories;
  }, [integrations]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const connectedCategories = categoryInfo.filter((c) => c.connectedCount > 0).length;
    const totalIntegrations = integrations.filter((i) => i.status === 'connected').length;
    const lastSyncDates = integrations
      .filter((i) => i.status === 'connected')
      .map((i) => new Date(i.lastSync));
    const lastSync =
      lastSyncDates.length > 0
        ? format(new Date(Math.max(...lastSyncDates.map((d) => d.getTime()))), 'MMM d, yyyy HH:mm')
        : 'Never';

    return { connectedCategories, totalIntegrations, lastSync };
  }, [integrations, categoryInfo]);

  const handleConnect = (id: string) => {
    connectIntegration(id);
    toast({
      title: 'Integration Connected',
      description: 'The integration has been successfully connected.',
    });
  };

  const handleDisconnect = (id: string) => {
    setIntegrationToDisconnect(id);
    setShowDisconnectDialog(true);
  };

  const confirmDisconnect = () => {
    if (integrationToDisconnect) {
      disconnectIntegration(integrationToDisconnect);
      toast({
        title: 'Integration Disconnected',
        description: 'The integration has been disconnected.',
      });
      setIntegrationToDisconnect(null);
      setShowDisconnectDialog(false);
    }
  };

  const handleSync = (id: string) => {
    syncIntegration(id);
    toast({
      title: 'Sync Started',
      description: 'The integration is being synced.',
    });
  };

  const handleSettings = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowSettingsDialog(true);
  };

  const handleSaveSettings = (settings: any) => {
    if (selectedIntegration) {
      updateIntegrationSettings(selectedIntegration.id, settings);
      toast({
        title: 'Settings Updated',
        description: 'Integration settings have been saved.',
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Connection Hub</h2>
        <p className="text-muted-foreground">
          Manage all your third-party integrations in one place
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Connected Categories</CardDescription>
            <CardTitle className="text-4xl">{summaryStats.connectedCategories}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Integrations</CardDescription>
            <CardTitle className="text-4xl">{summaryStats.totalIntegrations}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Last Sync</CardDescription>
            <CardTitle className="text-lg">{summaryStats.lastSync}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Accordion type="multiple" className="space-y-4">
        {categoryInfo.map((category) => {
          const CategoryIcon = categoryIcons[category.id];
          const categoryIntegrations = integrations.filter(
            (i) => i.category === category.id
          );

          return (
            <AccordionItem
              key={category.id}
              value={category.id}
              className="border rounded-lg bg-card"
            >
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    <CategoryIcon className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {category.hasErrors && (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {category.connectedCount} / {category.totalAvailable} Connected
                      </p>
                      {category.lastSync && (
                        <p className="text-xs text-muted-foreground">
                          Last sync: {format(new Date(category.lastSync), 'MMM d, HH:mm')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                {categoryIntegrations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No integrations available</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {categoryIntegrations.map((integration) => (
                      integration.seatBased ? (
                        <UnipleSocialIntegration
                          key={integration.id}
                          integration={integration}
                        />
                      ) : (
                        <IntegrationCard
                          key={integration.id}
                          integration={integration}
                          onConnect={() => handleConnect(integration.id)}
                          onDisconnect={() => handleDisconnect(integration.id)}
                          onSync={() => handleSync(integration.id)}
                          onSettings={() => handleSettings(integration)}
                        />
                      )
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <IntegrationSettingsDialog
        integration={selectedIntegration}
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        onSave={handleSaveSettings}
      />

      <AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Integration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect this integration? This action will stop all
              syncing and you'll need to reconnect to resume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDisconnect}>Disconnect</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default ConnectionHub;
