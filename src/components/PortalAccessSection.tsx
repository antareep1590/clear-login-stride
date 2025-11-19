import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Client, ClientContact } from '@/types/client';
import { Settings, User, LogIn, Send, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface PortalAccessSectionProps {
  client: Client;
  onEditPortalSettings: () => void;
  onManageContactPortal: (contact: ClientContact) => void;
  onTogglePortal: (enabled: boolean) => void;
}

export function PortalAccessSection({ 
  client, 
  onEditPortalSettings,
  onManageContactPortal,
  onTogglePortal
}: PortalAccessSectionProps) {
  const contactsWithPortal = client.contacts.filter(c => c.portalAccess?.enabled);

  return (
    <div className="space-y-6">
      {/* Portal Status Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Portal Settings</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onEditPortalSettings}
          >
            Configure
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Portal Access</p>
              <p className="text-sm text-muted-foreground">
                {client.portalEnabled 
                  ? 'Client portal is enabled and accessible to invited contacts'
                  : 'Client portal is disabled'
                }
              </p>
            </div>
            <Switch 
              checked={client.portalEnabled}
              onCheckedChange={onTogglePortal}
            />
          </div>

          {client.portalEnabled && client.portalSettings && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Dashboard Access</p>
                <div className="flex items-center gap-2">
                  {client.portalSettings.dashboardAccess ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <p className="font-medium text-foreground">
                    {client.portalSettings.dashboardAccess ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">File Access</p>
                <div className="flex items-center gap-2">
                  {client.portalSettings.fileAccess ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <p className="font-medium text-foreground">
                    {client.portalSettings.fileAccess ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Visible Jobs</p>
                <p className="font-medium text-foreground">
                  {client.portalSettings.jobsVisible?.length || 0} jobs
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Contact Portal Access */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Contact Portal Access</h3>
            <Badge variant="secondary">{contactsWithPortal.length} active</Badge>
          </div>
        </div>

        {client.contacts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No contacts available. Add contacts to grant portal access.</p>
          </div>
        ) : (
          <div className="border border-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Portal Status</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Invitation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {client.contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{contact.name}</p>
                        {contact.title && (
                          <p className="text-sm text-muted-foreground">{contact.title}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{contact.email}</TableCell>
                    <TableCell>
                      {contact.portalAccess?.enabled ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Disabled
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {contact.portalAccess?.username || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {contact.portalAccess?.lastLogin 
                        ? format(new Date(contact.portalAccess.lastLogin), 'MMM d, yyyy h:mm a')
                        : '—'
                      }
                    </TableCell>
                    <TableCell>
                      {contact.portalAccess?.invitationSent ? (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Send className="h-3 w-3" />
                          <span className="text-sm">
                            {format(new Date(contact.portalAccess.invitationSent), 'MMM d, yyyy')}
                          </span>
                        </div>
                      ) : contact.portalAccess?.enabled ? (
                        <Badge variant="outline">Pending</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onManageContactPortal(contact)}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Activity Log */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <LogIn className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Portal Activity</h3>
        </div>

        <div className="space-y-3">
          {contactsWithPortal.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No portal activity yet</p>
            </div>
          ) : (
            contactsWithPortal
              .filter(c => c.portalAccess?.lastLogin)
              .sort((a, b) => 
                new Date(b.portalAccess!.lastLogin!).getTime() - 
                new Date(a.portalAccess!.lastLogin!).getTime()
              )
              .slice(0, 10)
              .map((contact) => (
                <div 
                  key={contact.id} 
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <LogIn className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">Portal Login</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(contact.portalAccess!.lastLogin!), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>
      </Card>
    </div>
  );
}
