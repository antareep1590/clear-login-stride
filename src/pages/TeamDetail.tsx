import { useParams, useNavigate } from 'react-router-dom';
import { useTeams } from '@/contexts/TeamsContext';
import { useEmployees } from '@/contexts/EmployeesContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Users, TrendingUp, Target, Award, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getTeamById } = useTeams();
  const { getEmployeeById } = useEmployees();

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

  const managers = team.managerIds.map(id => getEmployeeById(id)).filter(Boolean);
  const members = team.memberIds.map(id => getEmployeeById(id)).filter(Boolean);

  const handleMessageTeam = () => {
    toast({
      title: "Message Team",
      description: "Email functionality would be integrated here",
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
              <p className="text-muted-foreground">{team.department}</p>
              <p className="text-sm text-muted-foreground">Created: {new Date(team.createdDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleMessageTeam}>
              <Mail className="mr-2 h-4 w-4" />
              Message Team
            </Button>
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

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="kpis">KPIs & Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Managers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {managers.map(manager => (
                  <div
                    key={manager.id}
                    className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => navigate(`/employees/${manager.id}`)}
                  >
                  <Avatar>
                    <AvatarImage src={manager.avatar} />
                    <AvatarFallback>
                      {manager.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{manager.name}</p>
                    <p className="text-sm text-muted-foreground">{manager.jobTitle}</p>
                    <Badge variant="outline" className="mt-1">Manager</Badge>
                  </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members ({members.length})</CardTitle>
              </div>
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
        </TabsContent>

        <TabsContent value="kpis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hires</CardTitle>
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
                <CardTitle className="text-sm font-medium">Placements</CardTitle>
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

          <Card>
            <CardHeader>
              <CardTitle>Revenue Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                ${team.kpis.revenue.toLocaleString()}
              </div>
              {team.targetKPIs && (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Target: ${team.targetKPIs.revenue.toLocaleString()}
                  </p>
                  <Badge variant={team.kpis.revenue >= team.targetKPIs.revenue ? 'default' : 'secondary'}>
                    {((team.kpis.revenue / team.targetKPIs.revenue) * 100).toFixed(0)}%
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
