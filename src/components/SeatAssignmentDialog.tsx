import { useState } from 'react';
import { SeatPermissionLevel } from '@/types/integration';
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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Users,
  Tag,
  Shield,
  Eye,
  Send,
  Settings,
  UserCog,
  X,
  Check,
  ChevronDown,
  Info,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock employee data - in real app would come from EmployeesContext
const mockEmployees = [
  { id: 'emp1', name: 'John Smith', email: 'john@company.com', avatar: '', department: 'Tech' },
  { id: 'emp2', name: 'Emily Davis', email: 'emily@company.com', avatar: '', department: 'Sales' },
  { id: 'emp3', name: 'Michael Brown', email: 'michael@company.com', avatar: '', department: 'HR' },
  { id: 'emp4', name: 'Sarah Johnson', email: 'sarah@company.com', avatar: '', department: 'Marketing' },
  { id: 'emp5', name: 'David Lee', email: 'david@company.com', avatar: '', department: 'Tech' },
];

// Available tags for filtering
const availableTags = [
  'tech-team', 'sales-team', 'recruiter', 'manager', 'senior-dev', 
  'backend-dev', 'designer', 'ui-ux', 'mumbai', 'bangalore',
  'remote', 'full-time', 'contract', 'leadership', 'intern'
];

const permissionLevels: {
  value: SeatPermissionLevel;
  label: string;
  description: string;
  icon: typeof Eye;
}[] = [
  {
    value: 'view_only',
    label: 'View Only',
    description: 'Can view candidates, messages, and openings but cannot send messages',
    icon: Eye,
  },
  {
    value: 'send_message',
    label: 'Send Message',
    description: 'Can send messages via LinkedIn/WhatsApp to accessible candidates',
    icon: Send,
  },
  {
    value: 'manage_openings',
    label: 'Manage Openings',
    description: 'Can assign candidates to openings and manage messaging workflows',
    icon: Settings,
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Full access: seat reassignment, permission changes, tag management',
    icon: Shield,
  },
];

interface SeatAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (data: {
    employeeIds: string[];
    permissionLevel: SeatPermissionLevel;
    accessibleTags: string[];
    notes: string;
  }) => void;
  editMode?: boolean;
  existingSeat?: {
    employeeId: string;
    employeeName: string;
    permissionLevel: SeatPermissionLevel;
    accessibleTags: string[];
    notes?: string;
  };
}

export const SeatAssignmentDialog = ({
  open,
  onOpenChange,
  onAssign,
  editMode = false,
  existingSeat,
}: SeatAssignmentDialogProps) => {
  const { toast } = useToast();
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(
    editMode && existingSeat ? [existingSeat.employeeId] : []
  );
  const [permissionLevel, setPermissionLevel] = useState<SeatPermissionLevel>(
    existingSeat?.permissionLevel || 'send_message'
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    existingSeat?.accessibleTags || []
  );
  const [notes, setNotes] = useState(existingSeat?.notes || '');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [tagSearch, setTagSearch] = useState('');
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [showTagList, setShowTagList] = useState(false);

  const handleEmployeeSelect = (employeeId: string) => {
    if (editMode) {
      // In edit mode, only allow one employee
      setSelectedEmployees([employeeId]);
    } else {
      // In add mode, allow multiple
      setSelectedEmployees(prev =>
        prev.includes(employeeId)
          ? prev.filter(id => id !== employeeId)
          : [...prev, employeeId]
      );
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddNewTag = () => {
    if (tagSearch.trim() && !availableTags.includes(tagSearch.trim())) {
      handleTagSelect(tagSearch.trim());
      setTagSearch('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const handleSubmit = () => {
    if (selectedEmployees.length === 0) {
      toast({
        title: 'Employee Required',
        description: 'Please select at least one employee',
        variant: 'destructive',
      });
      return;
    }

    onAssign({
      employeeIds: selectedEmployees,
      permissionLevel,
      accessibleTags: selectedTags,
      notes,
    });

    // Reset form
    if (!editMode) {
      setSelectedEmployees([]);
      setPermissionLevel('send_message');
      setSelectedTags([]);
      setNotes('');
    }
  };

  const selectedEmployeesList = mockEmployees.filter(emp =>
    selectedEmployees.includes(emp.id)
  );

  const filteredEmployees = mockEmployees.filter(
    emp =>
      emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      emp.email.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      emp.department.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  const filteredTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="w-5 h-5" />
            {editMode ? 'Edit Seat Permissions' : 'Assign Uniple Seat'}
          </DialogTitle>
          <DialogDescription>
            {editMode
              ? 'Update permissions and access for this seat assignment'
              : 'Assign this Uniple seat to employees and configure their permissions'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Employee Selection */}
          <div className="space-y-3">
            <div>
              <Label className="text-base font-semibold">
                {editMode ? 'Assigned Employee' : 'Select Employee(s)'}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {editMode
                  ? 'Currently assigned to this employee'
                  : 'Search and select one or multiple employees to assign this seat'}
              </p>
            </div>

            {/* Selected Employees */}
            {selectedEmployeesList.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                {selectedEmployeesList.map(emp => (
                  <Badge
                    key={emp.id}
                    variant="secondary"
                    className="flex items-center gap-2 pl-1 pr-2 py-1"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={emp.avatar} />
                      <AvatarFallback className="text-xs">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{emp.name}</span>
                    {!editMode && (
                      <button
                        onClick={() => handleEmployeeSelect(emp.id)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            )}

            {/* Employee Search/Select */}
            {!editMode && (
              <Popover open={showEmployeeList} onOpenChange={setShowEmployeeList}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {selectedEmployees.length === 0
                        ? 'Select employees...'
                        : `${selectedEmployees.length} selected`}
                    </span>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search employees..."
                      value={employeeSearch}
                      onValueChange={setEmployeeSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No employees found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-[200px]">
                          {filteredEmployees.map(emp => (
                            <CommandItem
                              key={emp.id}
                              onSelect={() => handleEmployeeSelect(emp.id)}
                              className="flex items-center gap-3"
                            >
                              <div
                                className={cn(
                                  'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                  selectedEmployees.includes(emp.id)
                                    ? 'bg-primary text-primary-foreground'
                                    : 'opacity-50'
                                )}
                              >
                                {selectedEmployees.includes(emp.id) && (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={emp.avatar} />
                                <AvatarFallback>
                                  {emp.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium">{emp.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {emp.email} • {emp.department}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>

          <Separator />

          {/* Permission Level */}
          <div className="space-y-3">
            <div>
              <Label className="text-base font-semibold">Permission Level</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Set what this employee can do with this Uniple seat
              </p>
            </div>

            <RadioGroup value={permissionLevel} onValueChange={(v) => setPermissionLevel(v as SeatPermissionLevel)}>
              <div className="space-y-2">
                {permissionLevels.map(level => {
                  const Icon = level.icon;
                  return (
                    <div
                      key={level.value}
                      className={cn(
                        'flex items-start space-x-3 space-y-0 rounded-lg border p-4 cursor-pointer transition-colors',
                        permissionLevel === level.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50'
                      )}
                      onClick={() => setPermissionLevel(level.value)}
                    >
                      <RadioGroupItem value={level.value} id={level.value} />
                      <div className="flex-1 space-y-1">
                        <Label
                          htmlFor={level.value}
                          className="flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <Icon className="w-4 h-4" />
                          {level.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {level.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Tag-Based Access */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Label className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tag-Based Access
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Select tags to grant access to specific candidates and openings. Employees can only interact with candidates/openings that have these tags.
                </p>
              </div>
            </div>

            {/* Tag Selection */}
            <div className="flex gap-2">
              <Popover open={showTagList} onOpenChange={setShowTagList}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-between">
                    <span className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Add tags...
                    </span>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search or add new tag..."
                      value={tagSearch}
                      onValueChange={setTagSearch}
                    />
                    <CommandList>
                      {filteredTags.length === 0 && tagSearch && (
                        <CommandEmpty>
                          <Button
                            variant="ghost"
                            className="w-full"
                            onClick={handleAddNewTag}
                          >
                            Create "{tagSearch}"
                          </Button>
                        </CommandEmpty>
                      )}
                      <CommandGroup>
                        <ScrollArea className="h-[150px]">
                          {filteredTags.map(tag => (
                            <CommandItem
                              key={tag}
                              onSelect={() => handleTagSelect(tag)}
                              className="flex items-center gap-2"
                            >
                              <div
                                className={cn(
                                  'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                  selectedTags.includes(tag)
                                    ? 'bg-primary text-primary-foreground'
                                    : 'opacity-50'
                                )}
                              >
                                {selectedTags.includes(tag) && (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                              {tag}
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Selected Tags */}
            {selectedTags.length > 0 ? (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                {selectedTags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-foreground">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-500" />
                <span>No tags selected - employee will have limited or no access to candidates and openings. Add tags to grant access.</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Optional Notes */}
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Add any additional notes about this assignment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Access Preview Panel */}
          <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <Shield className="w-4 h-4" />
              Assignment Summary
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Access Scope:</span>
                <span className="text-muted-foreground">
                  {selectedTags.length === 0 
                    ? "No tag-based access granted" 
                    : `Can access candidates/openings tagged with ${selectedTags.length} tag(s)`}
                </span>
              </div>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Permission:</span>
                <Badge variant="secondary">
                  {permissionLevels.find(p => p.value === permissionLevel)?.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Employees:</span>
                <span className="text-muted-foreground">
                  {selectedEmployees.length} assigned
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editMode ? 'Update Permissions' : 'Assign Seat'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
