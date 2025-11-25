import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTeams } from '@/contexts/TeamsContext';
import { useEmployees } from '@/contexts/EmployeesContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, Edit, Users, TrendingUp, Target, Award, Mail, DollarSign, Briefcase, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getTeamById } = useTeams();
  const { getEmployeeById } = useEmployees();
  const [showPastMembers, setShowPastMembers] = useState(false);

  const team = id ? getTeamById(id) : undefined;

  if (!team) {
    return (
      <main className="flex-1 p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-2">Team not found</h2>
          <Button onClick={() => navigate('/teams')}>Back to Teams</Button>
        </div>
      </main>
    );
  }

  // Only one manager per team
  const manager = team.managerIds.length > 0 ? getEmployeeById(team.managerIds[0]) : null;
  const members = team.memberIds.map(id => getEmployeeById(id)).filter(Boolean);
  
  // Past members and manager
  const previousManager = team.previousManagerIds && team.previousManagerIds.length > 0 
    ? getEmployeeById(team.previousManagerIds[0]) 
    : null;
  const previousMembers = team.previousMemberIds 
    ? team.previousMemberIds.map(id => getEmployeeById(id)).filter(Boolean)
    : [];

  const handleMessageTeam = () => {
    toast({
      title: "Coming Soon",
      description: "Internal messaging feature will be available soon",
      duration: 2500,
    });
  };

  return (
    <main className="flex-1 p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/teams')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Teams
        </Button>

        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={team.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {team.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{team.name}</h1>
                <Badge variant={team.status === 'active' ? 'default' : 'secondary'}>
                  {team.status}
                </Badge>
              </div>
              {manager && (
                <p className="text-muted-foreground">
                  Manager: {' '}
                  <span 
                    className="cursor-pointer hover:underline font-medium"
                    onClick={() => navigate(`/employees/${manager.id}`)}
                  >
                    {manager.name}
                  </span>
                </p>
              )}
              <p className="text-sm text-muted-foreground">Created: {new Date(team.createdDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {team.messagingEnabled !== false && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={handleMessageTeam}>
                      <Mail className="mr-2 h-4 w-4" />
                      Message Team
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming Soon</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Button onClick={() => navigate(`/teams/${team.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Team
            </Button>
          </div>
        </div>

        {team.description && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-muted-foreground">{team.description}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="kpis" className="space-y-6">
        <TabsList>
          <TabsTrigger value="kpis">KPIs & Performance</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="kpis" className="space-y-6">
          {/* KPI Cards - Openings | Hires | Placements | Revenue */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">Openings</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Openings created this year + openings with status updates this year</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.kpis.openings}</div>
                {team.targetKPIs && (
                  <p className="text-xs text-muted-foreground">
                    Target: {team.targetKPIs.openings}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">Hires</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Applicants who completed guarantee period (realised revenue)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.kpis.hires}</div>
                {team.targetKPIs && (
                  <p className="text-xs text-muted-foreground">
                    Target: {team.targetKPIs.hires}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">Placements</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Applicants who joined but guarantee period not completed (provisional revenue)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.kpis.placements}</div>
                {team.targetKPIs && (
                  <p className="text-xs text-muted-foreground">
                    Target: {team.targetKPIs.placements}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${team.kpis.revenue.toLocaleString()}</div>
                {team.targetKPIs && (
                  <p className="text-xs text-muted-foreground">
                    Target: ${team.targetKPIs.revenue.toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Target Revenue Section */}
          <Card>
            <CardHeader>
              <CardTitle>Team Revenue Targets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">1st Target Revenue</Label>
                  <div className="text-2xl font-bold">
                    {team.targetRevenue1 ? `$${team.targetRevenue1.toLocaleString()}` : '—'}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">2nd Target Revenue (Stretch)</Label>
                  <div className="text-2xl font-bold">
                    {team.targetRevenue2 ? `$${team.targetRevenue2.toLocaleString()}` : '—'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interviews</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.kpis.interviews}</div>
                {team.targetKPIs && (
                  <p className="text-xs text-muted-foreground">
                    Target: {team.targetKPIs.interviews}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Feedback Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.kpis.feedbackScore}</div>
                {team.targetKPIs && (
                  <p className="text-xs text-muted-foreground">
                    Target: {team.targetKPIs.feedbackScore}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          {/* Past Members Filter */}
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              id="past-members"
              checked={showPastMembers}
              onCheckedChange={setShowPastMembers}
            />
            <Label htmlFor="past-members" className="cursor-pointer">
              View Past Members/Manager
            </Label>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Team Members ({members.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map(member => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => navigate(`/employees/${member.id}`)}
                  >
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.jobTitle}</p>
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Past Members Section */}
          {showPastMembers && (previousManager || previousMembers.length > 0) && (
            <>
              {previousManager && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-muted-foreground">Previous Manager</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors opacity-60"
                      onClick={() => navigate(`/employees/${previousManager.id}`)}
                    >
                      <Avatar className="opacity-70">
                        <AvatarImage src={previousManager.avatar} />
                        <AvatarFallback>
                          {previousManager.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-muted-foreground">{previousManager.name}</p>
                        <p className="text-sm text-muted-foreground">{previousManager.jobTitle}</p>
                        <Badge variant="outline" className="mt-1">Previous Manager</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {previousMembers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-muted-foreground">Past Members ({previousMembers.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {previousMembers.map(member => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors opacity-60"
                          onClick={() => navigate(`/employees/${member.id}`)}
                        >
                          <Avatar className="opacity-70">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-muted-foreground">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.jobTitle}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
