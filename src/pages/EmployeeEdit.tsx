import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployees } from '@/contexts/EmployeesContext';
import { Employee, EmployeeRole, EmployeeStatus } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

const steps = [
  { id: 1, name: 'Basic Info', description: 'Name, email, and role' },
  { id: 2, name: 'Contact', description: 'Phone and address' },
  { id: 3, name: 'Job Details', description: 'Position and department' },
  { id: 4, name: 'Review', description: 'Confirm details' },
];

export default function EmployeeEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { updateEmployee, employees, getEmployeeById } = useEmployees();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast.error('Employee ID not found');
      navigate('/employees');
      return;
    }

    const employee = getEmployeeById(id);
    if (!employee) {
      toast.error('Employee not found');
      navigate('/employees');
      return;
    }

    setFormData(employee);
    setLoading(false);
  }, [id, getEmployeeById, navigate]);

  const updateField = (field: keyof Employee, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.email) {
          toast.error('Please fill in name and email');
          return false;
        }
        // Check for duplicate email, excluding current employee
        if (employees.some(emp => emp.email === formData.email && emp.id !== id)) {
          toast.error('Email already exists');
          return false;
        }
        return true;
      case 2:
        return true; // Optional fields
      case 3:
        if (!formData.jobTitle || !formData.department) {
          toast.error('Please fill in job title and department');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.jobTitle || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!id) return;

    updateEmployee(id, formData as Partial<Employee>);
    toast.success('Employee updated successfully');
    navigate(`/employees/${id}`);
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/employees/${id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Employee</h1>
            <p className="text-muted-foreground">Update employee profile</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted bg-background text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center hidden md:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 w-full ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="john.doe@company.com"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => updateField('role', value as EmployeeRole)}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recruiter">Recruiter</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="coordinator">Coordinator</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => updateField('status', value as EmployeeStatus)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="invited">Invited</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    value={formData.avatar || ''}
                    onChange={(e) => updateField('avatar', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </>
            )}

            {/* Step 2: Contact */}
            {currentStep === 2 && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location || ''}
                      onChange={(e) => updateField('location', e.target.value)}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address || ''}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="123 Main St, Apt 4B"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                  <Input
                    id="secondaryPhone"
                    value={formData.secondaryPhone || ''}
                    onChange={(e) => updateField('secondaryPhone', e.target.value)}
                    placeholder="+1 234 567 8901"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin || ''}
                    onChange={(e) => updateField('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </>
            )}

            {/* Step 3: Job Details */}
            {currentStep === 3 && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title *</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle || ''}
                      onChange={(e) => updateField('jobTitle', e.target.value)}
                      placeholder="Senior Recruiter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Input
                      id="department"
                      value={formData.department || ''}
                      onChange={(e) => updateField('department', e.target.value)}
                      placeholder="Recruitment"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="team">Team</Label>
                    <Input
                      id="team"
                      value={formData.team || ''}
                      onChange={(e) => updateField('team', e.target.value)}
                      placeholder="Tech Recruiting"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="managerId">Manager ID</Label>
                    <Input
                      id="managerId"
                      value={formData.managerId || ''}
                      onChange={(e) => updateField('managerId', e.target.value)}
                      placeholder="Manager employee ID"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hireDate">Hire Date</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      value={formData.hireDate?.split('T')[0] || ''}
                      onChange={(e) => updateField('hireDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfJoining">Date of Joining</Label>
                    <Input
                      id="dateOfJoining"
                      type="date"
                      value={formData.dateOfJoining?.split('T')[0] || ''}
                      onChange={(e) => updateField('dateOfJoining', e.target.value ? new Date(e.target.value).toISOString() : '')}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="font-semibold mb-3 text-foreground">Basic Information</h3>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <dt className="text-muted-foreground">Name:</dt>
                    <dd className="text-foreground">{formData.name}</dd>
                    <dt className="text-muted-foreground">Email:</dt>
                    <dd className="text-foreground">{formData.email}</dd>
                    <dt className="text-muted-foreground">Role:</dt>
                    <dd className="text-foreground capitalize">{formData.role}</dd>
                    <dt className="text-muted-foreground">Status:</dt>
                    <dd className="text-foreground capitalize">{formData.status}</dd>
                  </dl>
                </div>

                <div className="rounded-lg border bg-card p-4">
                  <h3 className="font-semibold mb-3 text-foreground">Contact Information</h3>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <dt className="text-muted-foreground">Phone:</dt>
                    <dd className="text-foreground">{formData.phone || 'Not provided'}</dd>
                    <dt className="text-muted-foreground">Location:</dt>
                    <dd className="text-foreground">{formData.location || 'Not provided'}</dd>
                    <dt className="text-muted-foreground">Address:</dt>
                    <dd className="text-foreground">{formData.address || 'Not provided'}</dd>
                    <dt className="text-muted-foreground">Secondary Phone:</dt>
                    <dd className="text-foreground">{formData.secondaryPhone || 'Not provided'}</dd>
                  </dl>
                </div>

                <div className="rounded-lg border bg-card p-4">
                  <h3 className="font-semibold mb-3 text-foreground">Job Details</h3>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <dt className="text-muted-foreground">Job Title:</dt>
                    <dd className="text-foreground">{formData.jobTitle}</dd>
                    <dt className="text-muted-foreground">Department:</dt>
                    <dd className="text-foreground">{formData.department}</dd>
                    <dt className="text-muted-foreground">Team:</dt>
                    <dd className="text-foreground">{formData.team || 'Not provided'}</dd>
                    <dt className="text-muted-foreground">Manager ID:</dt>
                    <dd className="text-foreground">{formData.managerId || 'Not provided'}</dd>
                  </dl>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          {currentStep < steps.length ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <Check className="mr-2 h-4 w-4" />
              Update Employee
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
