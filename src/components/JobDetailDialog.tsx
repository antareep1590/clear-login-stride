import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ClientJob, JobApplicant } from '@/types/client';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Users,
  Mail,
  Phone,
  FileText,
  Plus,
  Download,
  Trash2,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface JobDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: ClientJob;
  onAddApplicant: (applicant: Omit<JobApplicant, 'id' | 'appliedDate'>) => void;
  onUpdateApplicant: (applicantId: string, updates: Partial<JobApplicant>) => void;
  onDeleteApplicant: (applicantId: string) => void;
}

export function JobDetailDialog({
  open,
  onOpenChange,
  job,
  onAddApplicant,
  onUpdateApplicant,
  onDeleteApplicant,
}: JobDetailDialogProps) {
  const formatSalary = (range?: { min: number; max: number; currency: string }) => {
    if (!range) return 'Not specified';
    return `${range.currency} ${range.min.toLocaleString()} - ${range.max.toLocaleString()}`;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new': return 'secondary';
      case 'screening': return 'default';
      case 'interviewing': return 'default';
      case 'offered': return 'secondary';
      case 'rejected': return 'destructive';
      case 'hired': return 'default';
      default: return 'secondary';
    }
  };

  const handleStatusChange = (applicantId: string, newStatus: string) => {
    onUpdateApplicant(applicantId, { status: newStatus as any });
  };

  const handleDeleteApplicant = (applicantId: string) => {
    if (confirm('Are you sure you want to remove this applicant?')) {
      onDeleteApplicant(applicantId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{job.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Overview */}
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">{job.status}</Badge>
              <Badge variant="outline">{job.priority} priority</Badge>
              <Badge variant="outline">{job.department}</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>{formatSalary(job.salaryRange)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{job.openings} {job.openings === 1 ? 'position' : 'positions'}</span>
              </div>
              {job.closingDate && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Closes {new Date(job.closingDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="applicants">
                Applicants ({job.applicants.length})
              </TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Job Description</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>

              {job.requiredSkills.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {job.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Additional Notes</h4>
                  <p className="text-sm text-muted-foreground">{job.notes}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="applicants" className="space-y-4">
              {job.applicants.length === 0 ? (
                <Card className="p-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="font-medium mb-2">No Applicants Yet</h4>
                  <p className="text-sm text-muted-foreground">
                    Applicants will appear here once they apply for this position.
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {job.applicants.map((applicant) => (
                    <Card key={applicant.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3 flex-1">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {applicant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-medium">{applicant.name}</h5>
                                <Badge variant={getStatusBadgeVariant(applicant.status)}>
                                  {applicant.status}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                <a
                                  href={`mailto:${applicant.email}`}
                                  className="flex items-center gap-1 hover:text-primary"
                                >
                                  <Mail className="h-3 w-3" />
                                  {applicant.email}
                                </a>
                                {applicant.phone && (
                                  <a
                                    href={`tel:${applicant.phone}`}
                                    className="flex items-center gap-1 hover:text-primary"
                                  >
                                    <Phone className="h-3 w-3" />
                                    {applicant.phone}
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Applied {new Date(applicant.appliedDate).toLocaleDateString()}
                            </div>
                            {applicant.notes && (
                              <p className="text-sm text-muted-foreground">{applicant.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={applicant.status}
                            onValueChange={(value) => handleStatusChange(applicant.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="screening">Screening</SelectItem>
                              <SelectItem value="interviewing">Interviewing</SelectItem>
                              <SelectItem value="offered">Offered</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                              <SelectItem value="hired">Hired</SelectItem>
                            </SelectContent>
                          </Select>
                          {applicant.resumeUrl && (
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteApplicant(applicant.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-medium">{job.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Job Type:</span>
                  <span className="font-medium capitalize">{job.jobType.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium capitalize">{job.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority:</span>
                  <span className="font-medium capitalize">{job.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posted By:</span>
                  <span className="font-medium">{job.postedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posted Date:</span>
                  <span className="font-medium">
                    {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                </div>
                {job.closingDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Closing Date:</span>
                    <span className="font-medium">
                      {new Date(job.closingDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {job.filledDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Filled Date:</span>
                    <span className="font-medium">
                      {new Date(job.filledDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
