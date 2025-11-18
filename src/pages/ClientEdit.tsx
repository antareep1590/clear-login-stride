import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClients } from '@/contexts/ClientsContext';
import { useEmployees } from '@/contexts/EmployeesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ClientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getClientById, updateClient } = useClients();
  const { employees } = useEmployees();
  const client = getClientById(id!);
  const [formData, setFormData] = useState(client);

  useEffect(() => {
    if (client) setFormData(client);
  }, [client]);

  if (!client || !formData) {
    return <div className="flex-1 p-6">Client not found</div>;
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSubmit = () => {
    if (formData) {
      updateClient(id!, formData);
      toast({ title: 'Client updated successfully' });
      navigate(`/clients/${id}`);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate(`/clients/${id}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Client
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Client</h1>
        <p className="text-muted-foreground">Update client information</p>
      </div>

      <Card className="p-6 max-w-2xl">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Client Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="code">Client Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => updateField('code', e.target.value.toUpperCase())}
              />
            </div>

            <div>
              <Label htmlFor="owner">Owner</Label>
              <Select value={formData.ownerId} onValueChange={(value) => updateField('ownerId', value)}>
                <SelectTrigger>
                  <SelectValue />
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
                <Label>Tier</Label>
                <Select value={formData.tier} onValueChange={(value: any) => updateField('tier', value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="preferred">Preferred</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="probation">Probation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => updateField('status', value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={formData.notes || ''}
                onChange={(e) => updateField('notes', e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate(`/clients/${id}`)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
