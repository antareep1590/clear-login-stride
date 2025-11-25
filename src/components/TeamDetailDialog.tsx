import { useEmployees } from '@/contexts/EmployeesContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, Mail, Users, TrendingUp, Target, Award, DollarSign, Briefcase, Info } from 'lucide-react';
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
  const [showPastMembers, setShowPastMembers] = useState(false);

  if (!team) return null;

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
      title: "Coming Soon",
      description: "Internal messaging feature will be available soon",
      duration: 2500,
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
                {manager && (
                  <p className="text-sm text-muted-foreground">
                    Manager:{' '}
                    <span 
                      className="cursor-pointer hover:underline font-medium"
                      onClick={() => {
                        onOpenChange(false);
                        navigate(`/employees/${manager.id}`);
                      }}
                    >
                      {manager.name}
                    </span>
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Created: {new Date(team.createdDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {team.messagingEnabled !== false && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleMessageTeam}>
                        <Mail className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Coming Soon</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
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

        <Tabs defaultValue="kpis" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="kpis">KPIs & Performance</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="kpis" className="space-y-4">
            {/* KPI Cards - Openings | Hires | Placements | Revenue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <p className="text-xs text-muted-foreground">Target: {team.targetKPIs.openings}</p>
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
                    <p className="text-xs text-muted-foreground">Target: {team.targetKPIs.hires}</p>
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
                    <p className="text-xs text-muted-foreground">Target: {team.targetKPIs.placements}</p>
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
                    <p className="text-xs text-muted-foreground">Target: ${team.targetKPIs.revenue.toLocaleString()}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Target Revenue Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Revenue Targets</CardTitle>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            {/* Past Members Filter */}
            <div className="flex items-center space-x-2">
              <Switch
                id="past-members-dialog"
                checked={showPastMembers}
                onCheckedChange={setShowPastMembers}
              />
              <Label htmlFor="past-members-dialog" className="cursor-pointer">
                View Past Members/Manager
              </Label>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Members ({members.length})</CardTitle>
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

            {/* Past Members Section */}
            {showPastMembers && (previousManager || previousMembers.length > 0) && (
              <>
                {previousManager && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-muted-foreground">Previous Manager</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        onClick={() => {
                          onOpenChange(false);
                          navigate(`/employees/${previousManager.id}`);
                        }}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors opacity-60"
                      >
                        <Avatar className="opacity-70">
                          <AvatarImage src={previousManager.avatar} />
                          <AvatarFallback>{getInitials(previousManager.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-muted-foreground">{previousManager.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{previousManager.jobTitle}</p>
                        </div>
                        <Badge variant="outline">Previous Manager</Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {previousMembers.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-muted-foreground">Past Members ({previousMembers.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {previousMembers.map(member => (
                          <div
                            key={member!.id}
                            onClick={() => {
                              onOpenChange(false);
                              navigate(`/employees/${member!.id}`);
                            }}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors opacity-60"
                          >
                            <Avatar className="opacity-70">
                              <AvatarImage src={member!.avatar} />
                              <AvatarFallback>{getInitials(member!.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-muted-foreground">{member!.name}</p>
                              <p className="text-sm text-muted-foreground truncate">{member!.jobTitle}</p>
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
      </DialogContent>
    </Dialog>
  );
}
