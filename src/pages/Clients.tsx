import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '@/contexts/ClientsContext';
import { useEmployees } from '@/contexts/EmployeesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  MoreVertical,
  Building2,
  Users,
  Archive,
  Star,
  Filter,
  Download,
  Trash2,
  Tag,
  LayoutGrid,
  LayoutList,
  Kanban,
} from 'lucide-react';
import { Client } from '@/types/client';
import { toast } from '@/hooks/use-toast';

export default function Clients() {
  const navigate = useNavigate();
  const { clients, deleteClient, archiveClient, bulkUpdateClients, bulkDeleteClients } = useClients();
  const { getEmployeeById } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.industry.some(ind => ind.toLowerCase().includes(searchTerm.toLowerCase())) ||
        client.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      const matchesTier = tierFilter === 'all' || client.tier === tierFilter;

      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [clients, searchTerm, statusFilter, tierFilter]);

  const stats = useMemo(() => {
    const total = clients.length;
    const active = clients.filter(c => c.status === 'active').length;
    const archived = clients.filter(c => c.status === 'archived').length;
    const avgRating = clients.reduce((sum, c) => sum + c.rating, 0) / total || 0;

    return { total, active, archived, avgRating: avgRating.toFixed(1) };
  }, [clients]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredClients.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(cid => cid !== id));
    }
  };

  const handleBulkArchive = () => {
    bulkUpdateClients(selectedIds, { status: 'archived', pipelineStage: 'archived' });
    setSelectedIds([]);
    toast({ title: 'Clients archived successfully' });
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} client(s)?`)) {
      bulkDeleteClients(selectedIds);
      setSelectedIds([]);
      toast({ title: 'Clients deleted successfully' });
    }
  };

  const handleExportCSV = () => {
    const selectedClients = clients.filter(c => selectedIds.includes(c.id));
    const csvData = selectedClients.map(c => ({
      Name: c.name,
      Code: c.code,
      Status: c.status,
      Tier: c.tier,
      Owner: getEmployeeById(c.ownerId)?.name || '',
      Industry: c.industry.join('; '),
      Rating: c.rating,
      'Active Openings': c.activeOpenings,
    }));
    
    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clients-export.csv';
    a.click();
    
    toast({ title: 'Clients exported successfully' });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'archived': return 'outline';
      case 'prospect': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'vip': return 'default';
      case 'preferred': return 'default';
      case 'probation': return 'destructive';
      default: return 'secondary';
    }
  };


  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header with Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clients</h1>
            <p className="text-muted-foreground">Manage your client organizations</p>
          </div>
          <Button onClick={() => navigate('/clients/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Clients</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.archived}</p>
                <p className="text-sm text-muted-foreground">Archived</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.avgRating}</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients by name, code, industry, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="prospect">Prospect</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="preferred">Preferred</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="probation">Probation</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('table')}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/clients/pipeline')}
          >
            <Kanban className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedIds.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} client(s) selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkArchive}>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Button>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="p-4 w-12">
                    <Checkbox
                      checked={selectedIds.length === filteredClients.length && filteredClients.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Logo</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Client Name</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Code</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Tier</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Owner</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Industry</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Openings</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Rating</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map(client => {
                  const owner = getEmployeeById(client.ownerId);
                  const primaryContact = client.contacts.find(c => c.isPrimary);
                  
                  return (
                    <tr key={client.id} className="border-b border-border hover:bg-accent/50">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedIds.includes(client.id)}
                          onCheckedChange={(checked) => handleSelectOne(client.id, checked as boolean)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="text-2xl">{client.logo || '🏢'}</div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => navigate(`/clients/${client.id}`)}
                          className="font-medium text-foreground hover:underline"
                        >
                          {client.name}
                        </button>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">{client.code}</span>
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusBadgeVariant(client.status)}>
                          {client.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={getTierBadgeVariant(client.tier)}>
                          {client.tier}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {owner?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-foreground">{owner?.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {client.industry.slice(0, 2).map((ind, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {ind}
                            </Badge>
                          ))}
                          {client.industry.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{client.industry.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary">{client.activeOpenings}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-foreground">{client.rating}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}/edit`)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              archiveClient(client.id);
                              toast({ title: 'Client archived' });
                            }}>
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                if (confirm('Delete this client?')) {
                                  deleteClient(client.id);
                                  toast({ title: 'Client deleted' });
                                }
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredClients.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No clients found. Try adjusting your search or filters.
            </div>
          )}
        </Card>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map(client => {
            const owner = getEmployeeById(client.ownerId);
            
            return (
              <Card key={client.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/clients/${client.id}`)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{client.logo || '🏢'}</div>
                    <div>
                      <h3 className="font-semibold text-foreground">{client.name}</h3>
                      <p className="text-sm text-muted-foreground">{client.code}</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={selectedIds.includes(client.id)}
                    onCheckedChange={(checked) => handleSelectOne(client.id, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge variant={getStatusBadgeVariant(client.status)}>{client.status}</Badge>
                    <Badge variant={getTierBadgeVariant(client.tier)}>{client.tier}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {owner?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground">{owner?.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{client.activeOpenings} openings</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-foreground">{client.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {client.industry.slice(0, 3).map((ind, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {ind}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
