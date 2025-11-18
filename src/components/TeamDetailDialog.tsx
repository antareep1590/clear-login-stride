import { useEmployees } from '@/contexts/EmployeesContext';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Edit, Mail, Users, TrendingUp, Target, Award } from 'lucide-react';
import { Team } from '@/types/team';
import { useToast } from '@/hooks/use-toast';

interface TeamDetailDialogProps {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (team: Team) => void;
}

export function TeamDetailDialog({ team, open, onOpenChange, onEdit }: TeamDetailDialogProps) {
  const { getEmployeeById } = useEmployees();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!team) return null;

  const managers = team.managerIds.map(id => getEmployeeById(id)).filter(Boolean);
  const members = team.memberIds.map(id => getEmployeeById(id)).filter(Boolean);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleMessageTeam = () => {
    toast({
      title: "Message Team",
      description: "Email functionality would be integrated here",
    });
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={team.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {team.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <DialogTitle className="text-2xl">{team.name}</DialogTitle>
                  <Badge className={statusColors[team.status]}>
                    {team.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{team.department}</p>
                <p className="text-xs text-muted-foreground">Created: {new Date(team.createdDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleMessageTeam}>
                <Mail className="mr-2 h-4 w-4" />
                Message
              </Button>
              <Button size="sm" onClick={() => onEdit(team)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        </DialogHeader>

        {team.description && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">{team.description}</p>
          </div>
        )}

        <Tabs defaultValue="members" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="kpis">KPIs & Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Managers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {managers.map(manager => (
                    <div
                      key={manager!.id}
                      onClick={() => {
                        onOpenChange(false);
                        navigate(`/employees/${manager!.id}`);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors"
                    >
                      <Avatar>
                        <AvatarImage src={manager!.avatar} />
                        <AvatarFallback>{getInitials(manager!.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{manager!.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{manager!.jobTitle}</p>
                      </div>
                      <Badge className={statusColors[manager!.status as 'active' | 'inactive'] || 'bg-gray-100 text-gray-800'}>
                        {manager!.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {members.map(member => (
                    <div
                      key={member!.id}
                      onClick={() => {
                        onOpenChange(false);
                        navigate(`/employees/${member!.id}`);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors"
                    >
                      <Avatar>
                        <AvatarImage src={member!.avatar} />
                        <AvatarFallback>{getInitials(member!.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{member!.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{member!.jobTitle}</p>
                      </div>
                      <Badge className={statusColors[member!.status as 'active' | 'inactive'] || 'bg-gray-100 text-gray-800'}>
                        {member!.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kpis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Hires</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{team.kpis.hires}</div>
                  {team.targetKPIs && (
                    <p className="text-xs text-muted-foreground">Target: {team.targetKPIs.hires}</p>
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
                    <p className="text-xs text-muted-foreground">Target: {team.targetKPIs.placements}</p>
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
                    <p className="text-xs text-muted-foreground">Target: {team.targetKPIs.interviews}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Feedback Score</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{team.kpis.feedbackScore}/5</div>
                  {team.targetKPIs && (
                    <p className="text-xs text-muted-foreground">Target: {team.targetKPIs.feedbackScore}/5</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current: ${team.kpis.revenue.toLocaleString()}</span>
                  {team.targetKPIs && (
                    <span className="text-muted-foreground">Target: ${team.targetKPIs.revenue.toLocaleString()}</span>
                  )}
                </div>
                {team.targetKPIs && (
                  <Progress value={(team.kpis.revenue / team.targetKPIs.revenue) * 100} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
