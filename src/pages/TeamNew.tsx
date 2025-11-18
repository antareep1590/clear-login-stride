import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeams } from '@/contexts/TeamsContext';
import { useEmployees } from '@/contexts/EmployeesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TeamStatus } from '@/types/team';

export default function TeamNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addTeam, teams } = useTeams();
  const { employees } = useEmployees();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState<TeamStatus>('active');
  const [description, setDescription] = useState('');
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const departments = Array.from(new Set(teams.map(t => t.department)));
  const activeEmployees = employees.filter(e => e.status === 'active');

  const handleManagerToggle = (employeeId: string) => {
    setSelectedManagers(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleMemberToggle = (employeeId: string) => {
    setSelectedMembers(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Team name is required';
    } else if (teams.some(t => t.name.toLowerCase() === name.toLowerCase())) {
      newErrors.name = 'Team name must be unique';
    }

    if (!department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (selectedManagers.length === 0) {
      newErrors.managers = 'At least one manager is required';
    }

    if (selectedMembers.length === 0) {
      newErrors.members = 'At least one member is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Ensure managers are also in members list
    const allMembers = Array.from(new Set([...selectedMembers, ...selectedManagers]));

    addTeam({
      name: name.trim(),
      department: department.trim(),
      status,
      description: description.trim(),
      managerIds: selectedManagers,
      memberIds: allMembers,
      kpis: {
        hires: 0,
        placements: 0,
        interviews: 0,
        revenue: 0,
        feedbackScore: 0
      }
    });

    toast({
      title: "Success",
      description: "Team created successfully",
    });

    navigate('/teams');
  };

  return (
    <main className="flex-1 p-6">
      <Button variant="ghost" onClick={() => navigate('/teams')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Teams
      </Button>

      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create New Team</h1>
          <p className="text-muted-foreground">Set up a new team with managers and members</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Team Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Engineering Team"
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="department">Department *</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select or type department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
              {errors.department && <p className="text-sm text-destructive mt-1">{errors.department}</p>}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: TeamStatus) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the team's purpose and responsibilities"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Managers *</CardTitle>
            <p className="text-sm text-muted-foreground">Select one or more managers for this team</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activeEmployees.map(employee => (
                <div
                  key={employee.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                  onClick={() => handleManagerToggle(employee.id)}
                >
                  <Checkbox
                    checked={selectedManagers.includes(employee.id)}
                    onCheckedChange={() => handleManagerToggle(employee.id)}
                  />
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={employee.avatar} />
                    <AvatarFallback>
                      {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.jobTitle}</p>
                  </div>
                  {selectedManagers.includes(employee.id) && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
              ))}
            </div>
            {errors.managers && <p className="text-sm text-destructive mt-2">{errors.managers}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Members *</CardTitle>
            <p className="text-sm text-muted-foreground">Select team members (managers are automatically included)</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activeEmployees.map(employee => (
                <div
                  key={employee.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                  onClick={() => handleMemberToggle(employee.id)}
                >
                  <Checkbox
                    checked={selectedMembers.includes(employee.id)}
                    onCheckedChange={() => handleMemberToggle(employee.id)}
                  />
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={employee.avatar} />
                    <AvatarFallback>
                      {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.jobTitle}</p>
                  </div>
                  {selectedMembers.includes(employee.id) && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
              ))}
            </div>
            {errors.members && <p className="text-sm text-destructive mt-2">{errors.members}</p>}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate('/teams')}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Team
          </Button>
        </div>
      </div>
    </main>
  );
}
