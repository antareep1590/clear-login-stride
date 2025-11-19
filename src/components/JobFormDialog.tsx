import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClientJob } from '@/types/client';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface JobFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (job: Omit<ClientJob, 'id' | 'postedDate' | 'applicants'>) => void;
  initialData?: ClientJob;
  title: string;
}

export function JobFormDialog({ open, onOpenChange, onSubmit, initialData, title }: JobFormDialogProps) {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    department: string;
    location: string;
    jobType: 'full-time' | 'part-time' | 'contract' | 'temporary';
    status: 'open' | 'on-hold' | 'filled' | 'cancelled' | 'draft';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    salaryMin: string;
    salaryMax: string;
    currency: string;
    requiredSkills: string[];
    skillInput: string;
    postedBy: string;
    closingDate: string;
    openings: string;
    notes: string;
  }>({
    title: '',
    description: '',
    department: '',
    location: '',
    jobType: 'full-time',
    status: 'open',
    priority: 'medium',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    requiredSkills: [] as string[],
    skillInput: '',
    postedBy: 'Admin',
    closingDate: '',
    openings: '1',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        department: initialData.department,
        location: initialData.location,
        jobType: initialData.jobType,
        status: initialData.status,
        priority: initialData.priority,
        salaryMin: initialData.salaryRange?.min.toString() || '',
        salaryMax: initialData.salaryRange?.max.toString() || '',
        currency: initialData.salaryRange?.currency || 'USD',
        requiredSkills: initialData.requiredSkills,
        skillInput: '',
        postedBy: initialData.postedBy,
        closingDate: initialData.closingDate || '',
        openings: initialData.openings.toString(),
        notes: initialData.notes || '',
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const jobData: Omit<ClientJob, 'id' | 'postedDate' | 'applicants'> = {
      title: formData.title,
      description: formData.description,
      department: formData.department,
      location: formData.location,
      jobType: formData.jobType,
      status: formData.status,
      priority: formData.priority,
      salaryRange: formData.salaryMin && formData.salaryMax ? {
        min: parseInt(formData.salaryMin),
        max: parseInt(formData.salaryMax),
        currency: formData.currency,
      } : undefined,
      requiredSkills: formData.requiredSkills,
      postedBy: formData.postedBy,
      closingDate: formData.closingDate || undefined,
      openings: parseInt(formData.openings),
      notes: formData.notes || undefined,
    };

    onSubmit(jobData);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      department: '',
      location: '',
      jobType: 'full-time',
      status: 'open',
      priority: 'medium',
      salaryMin: '',
      salaryMax: '',
      currency: 'USD',
      requiredSkills: [],
      skillInput: '',
      postedBy: 'Admin',
      closingDate: '',
      openings: '1',
      notes: '',
    });
  };

  const addSkill = () => {
    if (formData.skillInput.trim() && !formData.requiredSkills.includes(formData.skillInput.trim())) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, formData.skillInput.trim()],
        skillInput: '',
      });
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter(s => s !== skill),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Fill in the job details below. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="jobType">Job Type *</Label>
                <Select value={formData.jobType} onValueChange={(value: any) => setFormData({ ...formData, jobType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="filled">Filled</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="salaryMin">Min Salary</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="salaryMax">Max Salary</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="skills">Required Skills</Label>
              <div className="flex gap-2">
                <Input
                  id="skills"
                  value={formData.skillInput}
                  onChange={(e) => setFormData({ ...formData, skillInput: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Add a skill and press Enter"
                />
                <Button type="button" onClick={addSkill}>Add</Button>
              </div>
              {formData.requiredSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1">
                      {skill}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="openings">Number of Openings *</Label>
                <Input
                  id="openings"
                  type="number"
                  min="1"
                  value={formData.openings}
                  onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="closingDate">Closing Date</Label>
                <Input
                  id="closingDate"
                  type="date"
                  value={formData.closingDate}
                  onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update Job' : 'Create Job'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
