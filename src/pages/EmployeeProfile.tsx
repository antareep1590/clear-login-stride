import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '@/contexts/EmployeesContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  TrendingUp,
  Users,
  Link as LinkIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { Employee, EmployeeStatus, EmployeeRole } from '@/types/employee';

const statusColors: Record<EmployeeStatus, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
  invited: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const roleLabels: Record<EmployeeRole, string> = {
  recruiter: 'Recruiter',
  manager: 'Manager',
  admin: 'Admin',
  coordinator: 'Coordinator',
  executive: 'Executive',
};

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEmployeeById, getEmployeesByManager } = useEmployees();

  const employee = getEmployeeById(id!);
  const directReports = employee ? getEmployeesByManager(employee.id) : [];

  if (!employee) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Employee not found</h2>
          <Button className="mt-4" onClick={() => navigate('/employees')}>
            Back to Employees
          </Button>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/employees')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Employee Profile</h1>
        </div>
        <Button onClick={() => navigate(`/employees/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={employee.avatar} alt={employee.name} />
              <AvatarFallback className="text-2xl">{getInitials(employee.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{employee.name}</h2>
                <p className="text-lg text-muted-foreground">{employee.jobTitle}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={statusColors[employee.status]}>{employee.status}</Badge>
                <Badge variant="secondary">{roleLabels[employee.role]}</Badge>
                <Badge variant="outline">{employee.department}</Badge>
                {employee.team && <Badge variant="outline">{employee.team}</Badge>}
              </div>
              <div className="grid gap-2 text-sm md:grid-cols-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {employee.email}
                </div>
                {employee.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {employee.phone}
                  </div>
                )}
                {employee.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {employee.location}
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Joined {format(new Date(employee.dateOfJoining), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Department</div>
                  <div className="text-foreground">{employee.department}</div>
                </div>
                {employee.team && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Team</div>
                    <div className="text-foreground">{employee.team}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Role</div>
                  <div className="text-foreground">{roleLabels[employee.role]}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Hire Date</div>
                  <div className="text-foreground">{format(new Date(employee.hireDate), 'MMMM d, yyyy')}</div>
                </div>
              </CardContent>
            </Card>

            {employee.skills && employee.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">
                        {skill.name} · {skill.level}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {employee.education && employee.education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {employee.education.map((edu, idx) => (
                    <div key={idx}>
                      <div className="font-medium text-foreground">{edu.degree} in {edu.field}</div>
                      <div className="text-sm text-muted-foreground">{edu.school}</div>
                      <div className="text-sm text-muted-foreground">
                        {edu.startYear} - {edu.endYear}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {employee.experience && employee.experience.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {employee.experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="font-medium text-foreground">{exp.position}</div>
                      <div className="text-sm text-muted-foreground">{exp.company}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(exp.startDate), 'MMM yyyy')} -{' '}
                        {exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'Present'}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {employee.kpis ? (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Hires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{employee.kpis.hires}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Interviews Conducted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{employee.kpis.interviews}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Offers Made</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{employee.kpis.offers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Placements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{employee.kpis.placements}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    ${employee.kpis.revenue.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No performance data available
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          {directReports.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Direct Reports ({directReports.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {directReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => navigate(`/employees/${report.id}`)}
                  >
                    <Avatar>
                      <AvatarImage src={report.avatar} alt={report.name} />
                      <AvatarFallback>{getInitials(report.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{report.name}</div>
                      <div className="text-sm text-muted-foreground">{report.jobTitle}</div>
                    </div>
                    <Badge variant="secondary">{roleLabels[report.role]}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No direct reports
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
