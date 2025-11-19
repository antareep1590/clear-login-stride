import { Integration } from '@/types/integration';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Settings, RefreshCw, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface IntegrationCardProps {
  integration: Integration;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
  onSettings: () => void;
}

const statusConfig = {
  connected: { color: 'bg-green-500/10 text-green-700 border-green-200', icon: CheckCircle2, label: 'Connected' },
  disconnected: { color: 'bg-muted text-muted-foreground border-border', icon: XCircle, label: 'Disconnected' },
  error: { color: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertCircle, label: 'Error' },
  expired: { color: 'bg-orange-500/10 text-orange-700 border-orange-200', icon: Clock, label: 'Expired' },
};

export function IntegrationCard({
  integration,
  onConnect,
  onDisconnect,
  onSync,
  onSettings,
}: IntegrationCardProps) {
  const config = statusConfig[integration.status];
  const StatusIcon = config.icon;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
            {integration.logo || '📧'}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{integration.name}</h3>
            {integration.account && (
              <p className="text-sm text-muted-foreground">{integration.account}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={config.color}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        </div>
      </div>

      {integration.errorMessage && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
          <p className="text-sm text-destructive">{integration.errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Last Sync</p>
          <p className="text-sm font-medium">
            {format(new Date(integration.lastSync), 'MMM d, yyyy HH:mm')}
          </p>
        </div>
        {integration.owner && (
          <div>
            <p className="text-sm text-muted-foreground">Owner</p>
            <p className="text-sm font-medium">{integration.owner}</p>
          </div>
        )}
      </div>

      {integration.stats && integration.stats.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-muted/50 rounded-md">
          {integration.stats.map((stat, index) => (
            <div key={index}>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {integration.recentActivity && integration.recentActivity.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Recent Activity</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {integration.recentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.name}</TableCell>
                  <TableCell className="text-right">{activity.count}</TableCell>
                  <TableCell>
                    <Badge variant={activity.status === 'sent' ? 'default' : 'secondary'}>
                      {activity.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(activity.lastUpdated), 'MMM d, HH:mm')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex gap-2">
        {integration.status === 'connected' && (
          <>
            <Button variant="outline" size="sm" onClick={onDisconnect}>
              Disconnect
            </Button>
            <Button variant="outline" size="sm" onClick={onSync}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Sync Now
            </Button>
            <Button variant="outline" size="sm" onClick={onSettings}>
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
          </>
        )}
        {(integration.status === 'disconnected' || 
          integration.status === 'error' || 
          integration.status === 'expired') && (
          <Button onClick={onConnect}>
            {integration.status === 'expired' ? 'Reconnect' : 'Connect'}
          </Button>
        )}
      </div>
    </Card>
  );
}
