import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeams } from '@/contexts/TeamsContext';
import { useEmployees } from '@/contexts/EmployeesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Users, TrendingUp, Target, Award } from 'lucide-react';
import { Team } from '@/types/team';

export default function Teams() {
  const navigate = useNavigate();
  const { teams } = useTeams();
  const { getEmployeeById } = useEmployees();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const departments = Array.from(new Set(teams.map(t => t.department)));

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || team.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || team.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getManagerNames = (managerIds: string[]) => {
    return managerIds
      .map(id => getEmployeeById(id))
      .filter(Boolean)
      .map(emp => emp!.name)
      .join(', ');
  };

  if (teams.length === 0) {
    return (
      <main className="flex-1 p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No teams found</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Get started by creating your first team! Use teams to group members, establish reporting, track group KPIs and improve collaboration.
          </p>
          <Button onClick={() => navigate('/teams/new')} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Team
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Teams</h1>
            <p className="text-muted-foreground">Manage and organize your teams</p>
          </div>
          <Button onClick={() => navigate('/teams/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Team
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map(team => (
          <Card
            key={team.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/teams/${team.id}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={team.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {team.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{team.department}</p>
                  </div>
                </div>
                <Badge variant={team.status === 'active' ? 'default' : 'secondary'}>
                  {team.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Manager(s)</p>
                  <p className="text-sm font-medium">{getManagerNames(team.managerIds) || 'Unassigned'}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{team.memberIds.length} members</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Hires</p>
                      <p className="text-sm font-semibold">{team.kpis.hires}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Placements</p>
                      <p className="text-sm font-semibold">{team.kpis.placements}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Score</p>
                      <p className="text-sm font-semibold">{team.kpis.feedbackScore}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-sm font-semibold">${(team.kpis.revenue / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
