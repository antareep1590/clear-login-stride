import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '@/contexts/ClientsContext';
import { useEmployees } from '@/contexts/EmployeesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Client } from '@/types/client';
import { toast } from '@/hooks/use-toast';

export default function ClientNew() {
  const navigate = useNavigate();
  const { addClient } = useClients();
  const { employees } = useEmployees();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    code: '',
    logo: '🏢',
    companyType: 'private',
    companySize: 'medium',
    status: 'prospect',
    tier: 'standard',
    pipelineStage: 'prospect',
    rating: 0,
    ownerId: '',
    teamIds: [],
    contacts: [],
    industry: [],
    regions: [],
    activeOpenings: 0,
    totalOpenings: 0,
    documents: [],
    commissionRules: [],
    portalEnabled: false,
    tags: [],
    sentimentTags: [],
    feedback: [],
  });

  const updateField = (field: keyof Client, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.code || !formData.ownerId) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    const newClient = addClient({
      ...formData as Omit<Client, 'id' | 'createdAt' | 'updatedAt'>,
      createdBy: formData.ownerId,
      updatedBy: formData.ownerId,
    });

    toast({ title: 'Client created successfully' });
    navigate(`/clients/${newClient.id}`);
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/clients')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Clients
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Add New Client</h1>
        <p className="text-muted-foreground">Create a new client organization</p>
      </div>

      <Card className="p-6 max-w-2xl">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Client Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Company Name"
              />
            </div>

            <div>
              <Label htmlFor="code">Client Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => updateField('code', e.target.value.toUpperCase())}
                placeholder="CLT001"
              />
            </div>

            <div>
              <Label htmlFor="owner">Owner *</Label>
              <Select value={formData.ownerId} onValueChange={(value) => updateField('ownerId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {employees.filter(e => e.status === 'active').map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyType">Company Type</Label>
                <Select value={formData.companyType} onValueChange={(value: any) => updateField('companyType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="nonprofit">Nonprofit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="companySize">Company Size</Label>
                <Select value={formData.companySize} onValueChange={(value: any) => updateField('companySize', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tier">Tier</Label>
                <Select value={formData.tier} onValueChange={(value: any) => updateField('tier', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="preferred">Preferred</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="probation">Probation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => updateField('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate('/clients')}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Client
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
