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
  const [employeeSearchOpen, setEmployeeSearchOpen] = useState(false);
  const [tagSearchOpen, setTagSearchOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleEmployeeSelect = (employeeId: string) => {
    if (editMode) {
      setSelectedEmployees([employeeId]);
    } else {
      setSelectedEmployees((prev) =>
        prev.includes(employeeId)
          ? prev.filter((id) => id !== employeeId)
          : [...prev, employeeId]
      );
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddNewTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags((prev) => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    if (selectedEmployees.length === 0) {
      toast({
        title: 'No Employees Selected',
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
    setSelectedEmployees([]);
    setPermissionLevel('send_message');
    setSelectedTags([]);
    setNotes('');
    onOpenChange(false);
  };

  const selectedEmployeeDetails = mockEmployees.filter((emp) =>
    selectedEmployees.includes(emp.id)
  );

  const currentPermission = permissionLevels.find((p) => p.value === permissionLevel);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="w-5 h-5 text-primary" />
            {editMode ? 'Edit Seat Assignment' : 'Assign Uniple Seat'}
          </DialogTitle>
          <DialogDescription>
            {editMode
              ? 'Update seat permissions and access restrictions'
              : 'Assign this seat to employees and configure their permissions'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <div className="space-y-6">
            {/* Employee Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {editMode ? 'Assigned Employee' : 'Select Employees'}
              </Label>
              <Popover open={employeeSearchOpen} onOpenChange={setEmployeeSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    <span className="truncate">
                      {selectedEmployees.length === 0
                        ? 'Search employees...'
                        : `${selectedEmployees.length} employee(s) selected`}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search by name or email..." />
                    <CommandList>
                      <CommandEmpty>No employees found.</CommandEmpty>
                      <CommandGroup>
                        {mockEmployees.map((employee) => (
                          <CommandItem
                            key={employee.id}
                            onSelect={() => handleEmployeeSelect(employee.id)}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <Check
                                className={cn(
                                  'w-4 h-4',
                                  selectedEmployees.includes(employee.id)
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={employee.avatar} />
                                <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-medium">{employee.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {employee.email} • {employee.department}
                                </div>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Selected Employees Display */}
              {selectedEmployeeDetails.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedEmployeeDetails.map((emp) => (
                    <Badge key={emp.id} variant="secondary" className="pl-2 pr-1 py-1">
                      <div className="flex items-center gap-1">
                        <Avatar className="w-4 h-4">
                          <AvatarImage src={emp.avatar} />
                          <AvatarFallback className="text-[8px]">
                            {emp.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{emp.name}</span>
                        {!editMode && (
                          <X
                            className="w-3 h-3 ml-1 cursor-pointer hover:text-destructive"
                            onClick={() => handleEmployeeSelect(emp.id)}
                          />
                        )}
                      </div>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Permission Level */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Permission Level
              </Label>
              <RadioGroup value={permissionLevel} onValueChange={(v) => setPermissionLevel(v as SeatPermissionLevel)}>
                <div className="space-y-2">
                  {permissionLevels.map((level) => {
                    const Icon = level.icon;
                    return (
                      <div
                        key={level.value}
                        className={cn(
                          'flex items-start space-x-3 rounded-lg border p-3 cursor-pointer transition-colors',
                          permissionLevel === level.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                        onClick={() => setPermissionLevel(level.value)}
                      >
                        <RadioGroupItem value={level.value} id={level.value} />
                        <div className="flex-1 space-y-1">
                          <Label
                            htmlFor={level.value}
                            className="flex items-center gap-2 cursor-pointer font-medium"
                          >
                            <Icon className="w-4 h-4 text-primary" />
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

            {/* Tag-Based Access Restrictions */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <Label className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Access Restrictions (Tags)
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select tags to restrict access to specific candidates and openings
                  </p>
                </div>
              </div>

              {/* Tag Selection */}
              <div className="flex gap-2">
                <Popover open={tagSearchOpen} onOpenChange={setTagSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Tag className="w-3 h-3" />
                        Select tags
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-2" align="start">
                    <ScrollArea className="h-48">
                      <div className="space-y-1">
                        {availableTags.map((tag) => (
                          <div
                            key={tag}
                            className={cn(
                              'flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-accent',
                              selectedTags.includes(tag) && 'bg-accent'
                            )}
                            onClick={() => handleTagSelect(tag)}
                          >
                            <Check
                              className={cn(
                                'w-4 h-4',
                                selectedTags.includes(tag) ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            <span className="text-sm">{tag}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Custom Tag Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewTag();
                    }
                  }}
                />
                <Button onClick={handleAddNewTag} variant="outline" size="sm">
                  Add
                </Button>
              </div>

              {/* Selected Tags Display */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="pr-1">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer hover:text-destructive"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}

              {selectedTags.length === 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                  <Info className="w-4 h-4" />
                  No restrictions - employee can access all candidates and openings
                </div>
              )}
            </div>

            <Separator />

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Add any notes about this assignment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Access Preview Panel */}
            {(selectedEmployees.length > 0 || currentPermission) && (
              <>
                <Separator />
                <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Access Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Employees: </span>
                      <span className="font-medium">
                        {selectedEmployees.length} selected
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Permission: </span>
                      <span className="font-medium">{currentPermission?.label}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Access Scope: </span>
                      <span className="font-medium">
                        {selectedTags.length === 0
                          ? 'All candidates and openings'
                          : `Restricted to ${selectedTags.length} tag(s)`}
                      </span>
                    </div>
                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedTags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editMode ? 'Update Assignment' : 'Assign Seat'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
