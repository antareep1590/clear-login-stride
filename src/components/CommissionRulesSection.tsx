import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DollarSign, Edit, Calendar, Plus } from 'lucide-react';
import { CommissionRule } from '@/types/client';
import { format } from 'date-fns';

interface CommissionRulesSectionProps {
  rules: CommissionRule[];
  onAddRule: () => void;
  onEditRule: (rule: CommissionRule) => void;
}

export function CommissionRulesSection({ rules, onAddRule, onEditRule }: CommissionRulesSectionProps) {
  const [filterType, setFilterType] = useState<'all' | 'percentage' | 'fixed'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('all');

  const isActive = (rule: CommissionRule) => {
    if (!rule.endDate) return true;
    return new Date(rule.endDate) > new Date();
  };

  const filteredRules = rules.filter(rule => {
    const typeMatch = filterType === 'all' || rule.type === filterType;
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'active' ? isActive(rule) : !isActive(rule));
    return typeMatch && statusMatch;
  });

  // Sort by start date, most recent first
  const sortedRules = [...filteredRules].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  if (rules.length === 0) {
    return (
      <Card className="p-12 text-center">
        <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Commission Rules</h3>
        <p className="text-muted-foreground mb-6">Get started by adding your first commission rule</p>
        <Button onClick={onAddRule}>
          <Plus className="mr-2 h-4 w-4" />
          Add Commission Rule
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onAddRule}>
          <Plus className="mr-2 h-4 w-4" />
          Add Rule
        </Button>
      </div>

      {/* Timeline View */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Commission Rules Timeline
          </h3>
          <div className="space-y-4">
            {sortedRules.map((rule, index) => {
              const active = isActive(rule);
              
              return (
                <div key={rule.id} className="relative">
                  {/* Timeline line */}
                  {index < sortedRules.length - 1 && (
                    <div className="absolute left-[9px] top-10 w-0.5 h-full bg-border" />
                  )}
                  
                  <div className="flex gap-4">
                    {/* Timeline dot */}
                    <div className={`relative z-10 mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 ${
                      active ? 'bg-primary border-primary' : 'bg-muted border-border'
                    }`} />
                    
                    {/* Rule card */}
                    <Card className="flex-1 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-foreground">{rule.name}</h4>
                            <Badge variant={active ? 'default' : 'secondary'}>
                              {active ? 'Active' : 'Expired'}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {rule.type}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 mb-2">
                            <span className="text-2xl font-bold text-primary">
                              {rule.type === 'percentage' ? `${rule.value}%` : `$${rule.value.toLocaleString()}`}
                            </span>
                          </div>
                          
                          {rule.appliesTo && (
                            <p className="text-sm text-muted-foreground mb-2">
                              Applies to: <span className="font-medium">{rule.appliesTo}</span>
                            </p>
                          )}
                          
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Start: {format(new Date(rule.startDate), 'MMM d, yyyy')}</span>
                            {rule.endDate ? (
                              <span>End: {format(new Date(rule.endDate), 'MMM d, yyyy')}</span>
                            ) : (
                              <span>No end date</span>
                            )}
                          </div>
                          
                          {rule.notes && (
                            <p className="text-sm text-muted-foreground mt-2 italic">{rule.notes}</p>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditRule(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Summary Table */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Rules Summary</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRules.map(rule => {
                const active = isActive(rule);
                
                return (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{rule.type}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {rule.type === 'percentage' ? `${rule.value}%` : `$${rule.value.toLocaleString()}`}
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(rule.startDate), 'MMM yyyy')} - {rule.endDate ? format(new Date(rule.endDate), 'MMM yyyy') : 'Ongoing'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={active ? 'default' : 'secondary'}>
                        {active ? 'Active' : 'Expired'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditRule(rule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
