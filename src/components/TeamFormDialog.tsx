import { useState, useEffect } from 'react';
import { useTeams } from '@/contexts/TeamsContext';
import { useEmployees } from '@/contexts/EmployeesContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Team, TeamStatus } from '@/types/team';
import { useToast } from '@/hooks/use-toast';

interface TeamFormDialogProps {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function TeamFormDialog({ team, open, onOpenChange, onSuccess }: TeamFormDialogProps) {
  const { addTeam, updateTeam, teams } = useTeams();
  const { employees } = useEmployees();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    status: 'active' as TeamStatus,
    description: '',
    managerIds: [] as string[],
    memberIds: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        department: team.department,
        status: team.status,
        description: team.description,
        managerIds: team.managerIds,
        memberIds: team.memberIds,
      });
    } else {
      setFormData({
        name: '',
        department: '',
        status: 'active',
        description: '',
        managerIds: [],
        memberIds: [],
      });
    }
    setErrors({});
  }, [team, open]);

  const activeEmployees = employees.filter(emp => emp.status === 'active');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleManager = (employeeId: string) => {
    setFormData(prev => ({
      ...prev,
      managerIds: prev.managerIds.includes(employeeId)
        ? prev.managerIds.filter(id => id !== employeeId)
        : [...prev.managerIds, employeeId],
    }));
  };

  const toggleMember = (employeeId: string) => {
    setFormData(prev => ({
      ...prev,
      memberIds: prev.memberIds.includes(employeeId)
        ? prev.memberIds.filter(id => id !== employeeId)
        : [...prev.memberIds, employeeId],
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    } else if (teams.some(t => t.name.toLowerCase() === formData.name.toLowerCase() && t.id !== team?.id)) {
      newErrors.name = 'Team name already exists';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (formData.managerIds.length === 0) {
      newErrors.managers = 'At least one manager is required';
    }

    if (formData.memberIds.length === 0) {
      newErrors.members = 'At least one member is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const teamData = {
      name: formData.name.trim(),
      department: formData.department.trim(),
      status: formData.status,
      description: formData.description.trim(),
      managerIds: formData.managerIds,
      memberIds: formData.memberIds,
      kpis: team?.kpis || {
        hires: 0,
        placements: 0,
        openings: 0,
        interviews: 0,
        revenue: 0,
        feedbackScore: 0,
      },
      createdDate: team?.createdDate || new Date().toISOString(),
    };

    if (team) {
      updateTeam(team.id, teamData);
      toast({
        title: 'Team Updated',
        description: `${teamData.name} has been successfully updated.`,
      });
    } else {
      addTeam(teamData);
      toast({
        title: 'Team Created',
        description: `${teamData.name} has been successfully created.`,
      });
    }

    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{team ? 'Edit Team' : 'Create New Team'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Engineering Team"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Technology"
              />
              {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: TeamStatus) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the team's purpose and responsibilities"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Team Managers *</Label>
            {errors.managers && <p className="text-sm text-destructive">{errors.managers}</p>}
            <ScrollArea className="h-48 rounded-md border p-4">
              <div className="space-y-2">
                {activeEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md">
                    <Checkbox
                      id={`manager-${employee.id}`}
                      checked={formData.managerIds.includes(employee.id)}
                      onCheckedChange={() => toggleManager(employee.id)}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback className="text-xs">{getInitials(employee.name)}</AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor={`manager-${employee.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <p className="text-sm font-medium">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.jobTitle}</p>
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <Label>Team Members *</Label>
            {errors.members && <p className="text-sm text-destructive">{errors.members}</p>}
            <ScrollArea className="h-48 rounded-md border p-4">
              <div className="space-y-2">
                {activeEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md">
                    <Checkbox
                      id={`member-${employee.id}`}
                      checked={formData.memberIds.includes(employee.id)}
                      onCheckedChange={() => toggleMember(employee.id)}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback className="text-xs">{getInitials(employee.name)}</AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor={`member-${employee.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <p className="text-sm font-medium">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.jobTitle}</p>
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {team ? 'Update Team' : 'Create Team'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
