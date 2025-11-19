import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ClientJob } from '@/types/client';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import { JobFormDialog } from './JobFormDialog';
import { JobDetailDialog } from './JobDetailDialog';

interface ClientJobsSectionProps {
  jobs: ClientJob[];
  clientId: string;
  onAddJob: (job: Omit<ClientJob, 'id' | 'postedDate' | 'applicants'>) => void;
  onUpdateJob: (jobId: string, updates: Partial<ClientJob>) => void;
  onDeleteJob: (jobId: string) => void;
  onAddApplicant: (jobId: string, applicant: any) => void;
  onUpdateApplicant: (jobId: string, applicantId: string, updates: any) => void;
  onDeleteApplicant: (jobId: string, applicantId: string) => void;
}

export function ClientJobsSection({
  jobs,
  clientId,
  onAddJob,
  onUpdateJob,
  onDeleteJob,
  onAddApplicant,
  onUpdateApplicant,
  onDeleteApplicant,
}: ClientJobsSectionProps) {
  // Ensure jobs is always an array
  const jobsList = jobs || [];
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ClientJob | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'default';
      case 'filled': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'on-hold': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const formatSalary = (range?: { min: number; max: number; currency: string }) => {
    if (!range) return 'Not specified';
    return `${range.currency} ${range.min.toLocaleString()} - ${range.max.toLocaleString()}`;
  };

  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleEdit = (job: ClientJob) => {
    setSelectedJob(job);
    setIsEditDialogOpen(true);
  };

  const handleViewDetails = (job: ClientJob) => {
    setSelectedJob(job);
    setIsDetailDialogOpen(true);
  };

  const handleDelete = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      onDeleteJob(jobId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Job Openings</h3>
          <p className="text-sm text-muted-foreground">
            {jobsList.length} {jobsList.length === 1 ? 'opening' : 'openings'} • {jobsList.filter(j => j.status === 'open').length} active
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </div>

      {jobsList.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Job Openings</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get started by creating your first job opening for this client.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobsList.map((job) => (
            <Card key={job.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold text-foreground">{job.title}</h4>
                        <Badge variant={getStatusBadgeVariant(job.status)}>
                          {job.status}
                        </Badge>
                        <Badge variant={getPriorityBadgeVariant(job.priority)}>
                          {job.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
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
                      <Users className="h-4 w-4" />
                      <span>{job.applicants.length} applicants</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Posted {getRelativeDate(job.postedDate)}</span>
                    </div>
                    {job.closingDate && (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Closes {new Date(job.closingDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <span>•</span>
                    <span>{job.openings} {job.openings === 1 ? 'position' : 'positions'}</span>
                  </div>

                  {job.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.slice(0, 5).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {job.requiredSkills.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.requiredSkills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewDetails(job)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(job)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(job.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <JobFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={onAddJob}
        title="Create New Job"
      />

      {selectedJob && (
        <>
          <JobFormDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSubmit={(updates) => {
              onUpdateJob(selectedJob.id, updates);
              setIsEditDialogOpen(false);
              setSelectedJob(null);
            }}
            initialData={selectedJob}
            title="Edit Job"
          />
          <JobDetailDialog
            open={isDetailDialogOpen}
            onOpenChange={setIsDetailDialogOpen}
            job={selectedJob}
            onAddApplicant={(applicant) => onAddApplicant(selectedJob.id, applicant)}
            onUpdateApplicant={(applicantId, updates) => 
              onUpdateApplicant(selectedJob.id, applicantId, updates)
            }
            onDeleteApplicant={(applicantId) => 
              onDeleteApplicant(selectedJob.id, applicantId)
            }
          />
        </>
      )}
    </div>
  );
}
