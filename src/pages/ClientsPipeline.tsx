import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '@/contexts/ClientsContext';
import { useEmployees } from '@/contexts/EmployeesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Search, Star, Plus } from 'lucide-react';
import { PipelineStage } from '@/types/client';
import { toast } from '@/hooks/use-toast';

const PIPELINE_STAGES: { stage: PipelineStage; title: string; color: string }[] = [
  { stage: 'prospect', title: 'Prospect', color: 'bg-slate-100 dark:bg-slate-800' },
  { stage: 'qualified', title: 'Qualified', color: 'bg-blue-100 dark:bg-blue-900' },
  { stage: 'negotiation', title: 'Negotiation', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { stage: 'active', title: 'Active', color: 'bg-green-100 dark:bg-green-900' },
  { stage: 'on-hold', title: 'On Hold', color: 'bg-orange-100 dark:bg-orange-900' },
  { stage: 'archived', title: 'Archived', color: 'bg-gray-100 dark:bg-gray-800' },
];

export default function ClientsPipeline() {
  const navigate = useNavigate();
  const { clients, updateClient } = useClients();
  const { getEmployeeById } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [clients, searchTerm]);

  const getClientsByStage = (stage: PipelineStage) => {
    return filteredClients.filter(client => client.pipelineStage === stage);
  };

  const handleDragStart = (clientId: string) => {
    setDraggedId(clientId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stage: PipelineStage) => {
    if (draggedId) {
      updateClient(draggedId, { pipelineStage: stage });
      toast({ title: `Client moved to ${stage}` });
      setDraggedId(null);
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
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/clients')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients List
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Client Pipeline</h1>
            <p className="text-muted-foreground">Drag and drop clients between stages</p>
          </div>
          <Button onClick={() => navigate('/clients/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 min-h-[600px]">
        {PIPELINE_STAGES.map(({ stage, title, color }) => {
          const stageClients = getClientsByStage(stage);

          return (
            <div
              key={stage}
              className={`rounded-lg p-4 ${color}`}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">{title}</h3>
                <Badge variant="outline">{stageClients.length}</Badge>
              </div>

              <div className="space-y-3">
                {stageClients.map(client => {
                  const owner = getEmployeeById(client.ownerId);

                  return (
                    <Card
                      key={client.id}
                      draggable
                      onDragStart={() => handleDragStart(client.id)}
                      className="p-3 cursor-move hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/clients/${client.id}`)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-xl">{client.logo || '🏢'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">
                              {client.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{client.code}</p>
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <Badge variant={getTierBadgeVariant(client.tier)} className="text-xs">
                            {client.tier}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          {owner && (
                            <div className="flex items-center gap-1">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-xs">
                                  {owner.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-foreground">{client.rating}</span>
                          </div>
                        </div>

                        {client.activeOpenings > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {client.activeOpenings} openings
                          </div>
                        )}

                        {client.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {client.tags.slice(0, 2).map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {client.nextActionDate && (
                          <div className="text-xs text-primary">
                            Next: {client.nextActionType}
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}

                {stageClients.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No clients in this stage
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
