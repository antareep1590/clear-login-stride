import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { AddTemplateDialog } from '@/components/AddTemplateDialog';
import { Search, Pencil, ArrowUpDown } from 'lucide-react';
import { Template } from '@/types/template';
import { useToast } from '@/hooks/use-toast';

const mockTemplates: Template[] = [
  {
    id: '1',
    title: 'Temp 1',
    subject: 'Hello {{candidateName}}, {{organizationName}}...',
    body: 'Full email body...',
    category: 'User',
    status: true,
    createdOn: 'Sep 20, 2023',
    updatedAt: 'Nov 18, 2025',
    usedHistory: 0,
  },
  {
    id: '2',
    title: 'Temp 2',
    subject: 'Hi',
    body: 'Email content...',
    category: 'Applicant',
    status: true,
    createdOn: 'Sep 20, 2023',
    updatedAt: 'Sep 20, 2023',
    usedHistory: 0,
  },
];

const TemplateManager = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof Template | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Template) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddTemplate = (newTemplate: {
    title: string;
    subject: string;
    body: string;
    category: string;
  }) => {
    const template: Template = {
      id: String(templates.length + 1),
      title: newTemplate.title,
      subject: newTemplate.subject,
      body: newTemplate.body,
      category: newTemplate.category as 'User' | 'Applicant' | 'Candidate',
      status: true,
      createdOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      usedHistory: 0,
    };
    setTemplates([...templates, template]);
    toast({
      title: "Template added",
      description: "Your template has been created successfully",
    });
  };

  const toggleStatus = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, status: !t.status } : t
    ));
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || template.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || 
                         (statusFilter === 'Active' && template.status) ||
                         (statusFilter === 'Inactive' && !template.status);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    const modifier = sortDirection === 'asc' ? 1 : -1;
    return aVal > bVal ? modifier : -modifier;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Template Manager</h1>
        <Button onClick={() => setAddDialogOpen(true)}>
          + Add Template
        </Button>
      </div>

      <div className="bg-card rounded-lg border p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Applicant">Applicant</SelectItem>
                <SelectItem value="Candidate">Candidate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1" />

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 font-semibold"
                  onClick={() => handleSort('title')}
                >
                  Title
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 font-semibold"
                  onClick={() => handleSort('subject')}
                >
                  Subject
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 font-semibold"
                  onClick={() => handleSort('createdOn')}
                >
                  Created On
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 font-semibold"
                  onClick={() => handleSort('updatedAt')}
                >
                  Updated At
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Used History</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTemplates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">{template.title}</TableCell>
                <TableCell className="max-w-xs truncate">{template.subject}</TableCell>
                <TableCell>{template.category}</TableCell>
                <TableCell>{template.createdOn}</TableCell>
                <TableCell>{template.updatedAt}</TableCell>
                <TableCell>{template.usedHistory}</TableCell>
                <TableCell>
                  <Switch
                    checked={template.status}
                    onCheckedChange={() => toggleStatus(template.id)}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddTemplateDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddTemplate}
      />
    </div>
  );
};

export default TemplateManager;
