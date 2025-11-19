import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useClients } from '@/contexts/ClientsContext';
import { useEmployees } from '@/contexts/EmployeesContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ClientNotesSection } from '@/components/ClientNotesSection';
import { ClientJobsSection } from '@/components/ClientJobsSection';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Star,
  Building2,
  FileText,
  DollarSign,
  Globe,
  Users,
  Activity,
  ExternalLink,
  Download,
  Trash2,
  Plus,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getClientById, deleteContact, deleteDocument, addFeedback, addNote, updateNote, deleteNote, pinNote, addJob, updateJob, deleteJob, addApplicant, updateApplicant, deleteApplicant } = useClients();
  const { getEmployeeById } = useEmployees();
  const [activeTab, setActiveTab] = useState('overview');

  const client = getClientById(id!);

  if (!client) {
    return (
      <div className="flex-1 p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Client not found</p>
          <Button onClick={() => navigate('/clients')} className="mt-4">
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  const owner = getEmployeeById(client.ownerId);
  const primaryContact = client.contacts.find(c => c.isPrimary);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'archived': return 'outline';
      case 'prospect': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'vip': return 'default';
      case 'preferred': return 'default';
      case 'probation': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/clients')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{client.logo || '🏢'}</div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{client.name}</h1>
              <p className="text-muted-foreground">{client.code}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant={getStatusBadgeVariant(client.status)}>{client.status}</Badge>
                <Badge variant={getTierBadgeVariant(client.tier)}>{client.tier}</Badge>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < client.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/clients/${client.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Active Openings</p>
            <p className="text-2xl font-bold text-foreground">{client.activeOpenings}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Contacts</p>
            <p className="text-2xl font-bold text-foreground">{client.contacts.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Documents</p>
            <p className="text-2xl font-bold text-foreground">{client.documents.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Rating</p>
            <p className="text-2xl font-bold text-foreground">{client.rating}/5</p>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="jobs">Jobs & Openings</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
          <TabsTrigger value="portal">Portal</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Client Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Company Type</p>
                  <p className="text-foreground capitalize">{client.companyType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company Size</p>
                  <p className="text-foreground capitalize">{client.companySize}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {client.industry.map((ind, i) => (
                      <Badge key={i} variant="outline">{ind}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {client.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Account Owner</h3>
              {owner && (
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback>
                      {owner.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{owner.name}</p>
                    <p className="text-sm text-muted-foreground">{owner.jobTitle}</p>
                    <p className="text-sm text-muted-foreground">{owner.email}</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Primary Contact */}
          {primaryContact && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Primary Contact</h3>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {primaryContact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{primaryContact.name}</p>
                  <p className="text-sm text-muted-foreground">{primaryContact.title}</p>
                  <div className="flex gap-4 mt-2">
                    <a href={`mailto:${primaryContact.email}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {primaryContact.email}
                    </a>
                    {primaryContact.phone && (
                      <a href={`tel:${primaryContact.phone}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {primaryContact.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Locations */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Locations</h3>
            <div className="space-y-3">
              {client.regions.map(region => (
                <div key={region.id} className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium text-foreground">
                      {region.name} {region.isHQ && <Badge variant="outline" className="ml-2">HQ</Badge>}
                    </p>
                    <p className="text-sm text-muted-foreground">{region.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Notes */}
          <ClientNotesSection
            notes={client.notes}
            onAddNote={(note) => addNote(client.id, note)}
            onUpdateNote={(noteId, updates) => updateNote(client.id, noteId, updates)}
            onDeleteNote={(noteId) => deleteNote(client.id, noteId)}
            onPinNote={(noteId, isPinned) => pinNote(client.id, noteId, isPinned)}
          />
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">All Contacts</h3>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.contacts.map(contact => (
              <Card key={contact.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{contact.name}</p>
                        {contact.isPrimary && <Badge variant="default">Primary</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{contact.title}</p>
                      {contact.department && (
                        <p className="text-sm text-muted-foreground">{contact.department}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm('Delete this contact?')) {
                        deleteContact(client.id, contact.id);
                        toast({ title: 'Contact deleted' });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Separator className="my-3" />
                <div className="space-y-2">
                  <a href={`mailto:${contact.email}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {contact.email}
                  </a>
                  {contact.phone && (
                    <a href={`tel:${contact.phone}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </a>
                  )}
                  {contact.linkedin && (
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      LinkedIn
                    </a>
                  )}
                  {contact.portalAccess?.enabled && (
                    <Badge variant="secondary">Portal Access</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <ClientJobsSection
            jobs={client.jobs}
            clientId={client.id}
            onAddJob={(job) => addJob(client.id, job)}
            onUpdateJob={(jobId, updates) => updateJob(client.id, jobId, updates)}
            onDeleteJob={(jobId) => deleteJob(client.id, jobId)}
            onAddApplicant={(jobId, applicant) => addApplicant(client.id, jobId, applicant)}
            onUpdateApplicant={(jobId, applicantId, updates) => updateApplicant(client.id, jobId, applicantId, updates)}
            onDeleteApplicant={(jobId, applicantId) => deleteApplicant(client.id, jobId, applicantId)}
          />
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">Documents & Compliance</h3>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.documents.map(doc => {
              const isExpiringSoon = doc.expiryDate && new Date(doc.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
              const isExpired = doc.expiryDate && new Date(doc.expiryDate) < new Date();
              
              return (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium text-foreground">{doc.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{doc.type}</p>
                        <Badge variant={doc.status === 'signed' ? 'default' : 'secondary'} className="mt-2">
                          {doc.status}
                        </Badge>
                        {isExpired && <Badge variant="destructive" className="ml-2">Expired</Badge>}
                        {!isExpired && isExpiringSoon && <Badge variant="outline" className="ml-2">Expiring Soon</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Delete this document?')) {
                            deleteDocument(client.id, doc.id);
                            toast({ title: 'Document deleted' });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()}</p>
                    {doc.expiryDate && <p>Expires: {new Date(doc.expiryDate).toLocaleDateString()}</p>}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Compliance Fields */}
          {client.complianceFields && (
            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Compliance Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">GDPR Compliant</p>
                  <Badge variant={client.complianceFields.gdprCompliant ? 'default' : 'secondary'}>
                    {client.complianceFields.gdprCompliant ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SOC2 Certified</p>
                  <Badge variant={client.complianceFields.soc2Certified ? 'default' : 'secondary'}>
                    {client.complianceFields.soc2Certified ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {client.complianceFields.references && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">References</p>
                    <p className="text-foreground">{client.complianceFields.references}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Commission Tab */}
        <TabsContent value="commission" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">Commission Rules</h3>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Rule
            </Button>
          </div>
          <div className="space-y-4">
            {client.commissionRules.map(rule => {
              const isActive = !rule.endDate || new Date(rule.endDate) > new Date();
              
              return (
                <Card key={rule.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{rule.name}</p>
                          <Badge variant={isActive ? 'default' : 'secondary'}>
                            {isActive ? 'Active' : 'Expired'}
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-foreground mt-2">
                          {rule.type === 'percentage' ? `${rule.value}%` : `$${rule.value}`}
                        </p>
                        {rule.appliesTo && (
                          <p className="text-sm text-muted-foreground mt-1">Applies to: {rule.appliesTo}</p>
                        )}
                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Start: {new Date(rule.startDate).toLocaleDateString()}</span>
                          {rule.endDate && <span>End: {new Date(rule.endDate).toLocaleDateString()}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Portal Tab */}
        <TabsContent value="portal" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Portal Access</h3>
                <p className="text-sm text-muted-foreground">Manage client portal settings and access</p>
              </div>
              <Badge variant={client.portalEnabled ? 'default' : 'secondary'}>
                {client.portalEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>

            {client.portalEnabled && client.portalSettings && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Enabled Features</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={client.portalSettings.dashboardAccess ? 'default' : 'secondary'}>
                        Dashboard Access
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={client.portalSettings.fileAccess ? 'default' : 'secondary'}>
                        File Access
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={client.portalSettings.jobsVisible.length > 0 ? 'default' : 'secondary'}>
                        {client.portalSettings.jobsVisible.length} Jobs Visible
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!client.portalEnabled && (
              <div className="text-center py-8">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Portal access is currently disabled</p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Activity Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-foreground">Client created</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(client.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {client.lastContactDate && (
                <div className="flex gap-3">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-foreground">Last contact</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(client.lastContactDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {client.nextActionDate && (
                <div className="flex gap-3">
                  <Activity className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-foreground">Upcoming: {client.nextActionType}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(client.nextActionDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Feedback Section */}
            <Separator className="my-6" />
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Feedback & Ratings</h4>
              {client.feedback.length > 0 ? (
                <div className="space-y-3">
                  {client.feedback.map(fb => (
                    <Card key={fb.id} className="p-4">
                      <div className="flex items-start gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < fb.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-foreground mt-2">{fb.comment}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(fb.createdDate).toLocaleDateString()}
                      </p>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No feedback yet</p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
