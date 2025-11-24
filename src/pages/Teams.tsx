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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Search, Users, TrendingUp, Target, Award, Info, Briefcase } from 'lucide-react';
import { Team } from '@/types/team';

export default function Teams() {
  const navigate = useNavigate();
  const { teams } = useTeams();
  const { getEmployeeById } = useEmployees();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  
  // Generate available years (current + 2 previous years if data exists)
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || team.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getManagerNames = (managerIds: string[]) => {
    return managerIds
      .map(id => getEmployeeById(id))
      .filter(Boolean)
      .map(emp => emp!.name)
      .join(', ');
  };

  const getMemberNames = (memberIds: string[]) => {
    return memberIds
      .map(id => getEmployeeById(id))
      .filter(Boolean)
      .map(emp => ({ name: emp!.name, title: emp!.jobTitle }));
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
    <TooltipProvider>
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

          {/* Year Selector and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year === currentYear ? `${year} (YTD)` : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Metrics Info Bar */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">Hires (Realized Revenue)</p>
                    <p className="text-sm">Total applicants who have joined and whose guarantee period (probation/refund window) has been completed.</p>
                  </TooltipContent>
                </Tooltip>
                <div>
                  <p className="text-sm font-medium">Hires</p>
                  <p className="text-xs text-muted-foreground">Realized Revenue</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">Placements (Provisional Revenue)</p>
                    <p className="text-sm">Total applicants who have joined but whose guarantee period has NOT yet been completed.</p>
                  </TooltipContent>
                </Tooltip>
                <div>
                  <p className="text-sm font-medium">Placements</p>
                  <p className="text-xs text-muted-foreground">Provisional Revenue</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">Openings (Workload)</p>
                    <p className="text-sm">Count includes openings created in the current year (YTD) and openings where any applicant's status was updated this year.</p>
                  </TooltipContent>
                </Tooltip>
                <div>
                  <p className="text-sm font-medium">Openings</p>
                  <p className="text-xs text-muted-foreground">Workload & Trends</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map(team => {
            const memberDetails = getMemberNames(team.memberIds);
            
            return (
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-help">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{team.memberIds.length} members</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          {memberDetails.length > 0 ? (
                            <div className="space-y-2">
                              <p className="font-semibold mb-2">Team Members:</p>
                              {memberDetails.map((member, idx) => (
                                <div key={idx} className="text-sm">
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-xs text-muted-foreground">{member.title}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm">No members assigned</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
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
                        <Briefcase className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Openings</p>
                          <p className="text-sm font-semibold">{team.kpis.openings}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                          <p className="text-sm font-semibold">${(team.kpis.revenue / 1000).toFixed(0)}K</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </TooltipProvider>
  );
}
