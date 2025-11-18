import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '@/contexts/EmployeesContext';
import { useAuth } from '@/contexts/AuthContext';
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

export default function EmployeeNew() {
  const navigate = useNavigate();
  const { addEmployee, employees } = useEmployees();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Employee>>({
    status: 'active',
    role: 'recruiter',
    department: 'Recruitment',
  });

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
        if (employees.some(emp => emp.email === formData.email)) {
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

    const now = new Date().toISOString();
    const newEmployee = addEmployee({
      ...formData as Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>,
      dateOfJoining: formData.dateOfJoining || now,
      hireDate: formData.hireDate || now,
    });

    toast.success('Employee created successfully');
    navigate(`/employees/${newEmployee.id}`);
  };

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/employees')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Add New Employee</h1>
            <p className="text-muted-foreground">Create a new employee profile</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    currentStep > step.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : currentStep === step.id
                      ? 'border-primary text-primary'
                      : 'border-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center hidden md:block">
                  <div className="text-sm font-medium text-foreground">{step.name}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredName">Preferred Name</Label>
                  <Input
                    id="preferredName"
                    value={formData.preferredName || ''}
                    onChange={(e) => updateField('preferredName', e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="john.doe@smoothire.com"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="role">
                      Role <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: EmployeeRole) => updateField('role', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                    <Label htmlFor="status">
                      Status <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: EmployeeStatus) => updateField('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="New York, NY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address || ''}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Full address"
                    rows={3}
                  />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">
                    Job Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle || ''}
                    onChange={(e) => updateField('jobTitle', e.target.value)}
                    placeholder="Senior Recruiter"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department">
                      Department <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="department"
                      value={formData.department || ''}
                      onChange={(e) => updateField('department', e.target.value)}
                      placeholder="Recruitment"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team">Team</Label>
                    <Input
                      id="team"
                      value={formData.team || ''}
                      onChange={(e) => updateField('team', e.target.value)}
                      placeholder="Tech Hiring"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managerId">Manager</Label>
                  <Select
                    value={formData.managerId || 'none'}
                    onValueChange={(value) => updateField('managerId', value === 'none' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No manager</SelectItem>
                      {employees
                        .filter(emp => emp.role === 'manager' || emp.role === 'admin')
                        .map(emp => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hireDate">Hire Date</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      value={formData.hireDate || ''}
                      onChange={(e) => updateField('hireDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfJoining">Start Date</Label>
                    <Input
                      id="dateOfJoining"
                      type="date"
                      value={formData.dateOfJoining || ''}
                      onChange={(e) => updateField('dateOfJoining', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Review Employee Details</h3>
                  <div className="space-y-4">
                    <div className="grid gap-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium text-foreground">{formData.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium text-foreground">{formData.email}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Role:</span>
                        <span className="font-medium text-foreground capitalize">{formData.role}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium text-foreground capitalize">{formData.status}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Job Title:</span>
                        <span className="font-medium text-foreground">{formData.jobTitle}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Department:</span>
                        <span className="font-medium text-foreground">{formData.department}</span>
                      </div>
                      {formData.team && (
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Team:</span>
                          <span className="font-medium text-foreground">{formData.team}</span>
                        </div>
                      )}
                      {formData.location && (
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium text-foreground">{formData.location}</span>
                        </div>
                      )}
                      {formData.phone && (
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="font-medium text-foreground">{formData.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
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
              Create Employee
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
