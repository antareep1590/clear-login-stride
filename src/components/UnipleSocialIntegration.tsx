import { useState } from 'react';
import { Integration, Candidate, MessageThread, SeatPermissionLevel } from '@/types/integration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Users,
  MessageSquare,
  Send,
  Plus,
  CreditCard,
  Tag,
  Linkedin,
  MessageCircle,
  Check,
  X,
  MoreVertical,
  Edit,
  UserX,
  Shield,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { SeatAssignmentDialog } from './SeatAssignmentDialog';

interface UnipleSocialIntegrationProps {
  integration: Integration;
}

export const UnipleSocialIntegration = ({ integration }: UnipleSocialIntegrationProps) => {
  const { toast } = useToast();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingSeat, setEditingSeat] = useState<string | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [messageChannel, setMessageChannel] = useState<'linkedin' | 'whatsapp'>('linkedin');
  const [seatsCount, setSeatsCount] = useState(1);

  const handlePurchaseSeats = () => {
    toast({
      title: 'Purchase Initiated',
      description: `Purchasing ${seatsCount} additional seat(s). Redirecting to payment...`,
    });
    setShowPurchaseModal(false);
  };

  const handleAssignSeat = (data: {
    employeeIds: string[];
    permissionLevel: SeatPermissionLevel;
    accessibleTags: string[];
    notes: string;
  }) => {
    toast({
      title: editingSeat ? 'Seat Updated' : 'Seat Assigned',
      description: editingSeat
        ? 'Seat permissions and access have been updated'
        : `Seat(s) assigned to ${data.employeeIds.length} employee(s) with ${data.permissionLevel} permission`,
    });
    setEditingSeat(null);
  };

  const handleEditSeat = (seatId: string) => {
    setEditingSeat(seatId);
    setShowAssignmentModal(true);
  };

  const handleRevokeSeat = (seatId: string, employeeName: string) => {
    toast({
      title: 'Seat Revoked',
      description: `Access revoked for ${employeeName}`,
      variant: 'destructive',
    });
  };

  const handleOpenAssignmentModal = () => {
    setEditingSeat(null);
    setShowAssignmentModal(true);
  };

  const getPermissionLabel = (level?: SeatPermissionLevel) => {
    switch (level) {
      case 'view_only':
        return 'View Only';
      case 'send_message':
        return 'Send Message';
      case 'manage_openings':
        return 'Manage Openings';
      case 'admin':
        return 'Admin';
      default:
        return 'Send Message';
    }
  };

  const getPermissionColor = (level?: SeatPermissionLevel) => {
    switch (level) {
      case 'view_only':
        return 'secondary';
      case 'send_message':
        return 'default';
      case 'manage_openings':
        return 'outline';
      case 'admin':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const editingSeatData = editingSeat
    ? integration.seatAccess?.find((s) => s.id === editingSeat)
    : undefined;

  const handleSendMessage = () => {
    if (!messageContent.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a message',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Message Sent',
      description: `Message sent to ${selectedCandidates.length} candidate(s) via ${messageChannel}`,
    });
    setMessageContent('');
    setSelectedCandidates([]);
    setShowMessageModal(false);
  };

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const openMessageModal = () => {
    if (selectedCandidates.length === 0) {
      toast({
        title: 'No Candidates Selected',
        description: 'Please select at least one candidate',
        variant: 'destructive',
      });
      return;
    }
    setShowMessageModal(true);
  };

  const openChatThread = (thread: MessageThread) => {
    setSelectedThread(thread);
    setShowChatModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Seat Management Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <CardTitle>Seat & Access Management</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleOpenAssignmentModal}
                variant="default"
                size="sm"
                disabled={(integration.seatsAvailable || 0) === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Assign Seat
              </Button>
              <Button onClick={() => setShowPurchaseModal(true)} variant="outline" size="sm">
                <CreditCard className="w-4 h-4 mr-2" />
                Buy More Access
              </Button>
            </div>
          </div>
          <CardDescription>
            {integration.seatsAssigned} of {integration.seatsTotal} seats assigned •{' '}
            {integration.seatsAvailable} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Permission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Access Tags</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {integration.seatAccess?.map((seat) => (
                <TableRow key={seat.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={seat.employeeAvatar} />
                        <AvatarFallback>{seat.employeeName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{seat.employeeName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPermissionColor(seat.permissionLevel)}>
                      <Shield className="w-3 h-3 mr-1" />
                      {getPermissionLabel(seat.permissionLevel)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        seat.status === 'active'
                          ? 'default'
                          : seat.status === 'inactive'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {seat.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap max-w-xs">
                      {seat.accessibleTags && seat.accessibleTags.length > 0 ? (
                        seat.accessibleTags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">All access</span>
                      )}
                      {seat.accessibleTags && seat.accessibleTags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{seat.accessibleTags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(seat.assignedDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditSeat(seat.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRevokeSeat(seat.id, seat.employeeName)}
                          className="text-destructive"
                        >
                          <UserX className="w-4 h-4 mr-2" />
                          Revoke Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Messaging Workflows Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <CardTitle>Candidates & Messaging</CardTitle>
            </div>
            <Button onClick={openMessageModal} disabled={selectedCandidates.length === 0}>
              <Send className="w-4 h-4 mr-2" />
              Send Message ({selectedCandidates.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="candidates">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="threads">Message Threads</TabsTrigger>
            </TabsList>

            <TabsContent value="candidates" className="space-y-4">
              <div className="space-y-2">
                {integration.candidates?.map((candidate) => (
                  <Card key={candidate.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedCandidates.includes(candidate.id)}
                            onCheckedChange={() => handleCandidateSelect(candidate.id)}
                          />
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={candidate.avatar} />
                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{candidate.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {candidate.jobApplied}
                            </div>
                            <div className="flex gap-1 mt-1">
                              {(candidate.tags || []).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {candidate.linkedinUrl && (
                            <Badge variant="outline">
                              <Linkedin className="w-3 h-3 mr-1" />
                              LinkedIn
                            </Badge>
                          )}
                          {candidate.whatsappNumber && (
                            <Badge variant="outline">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              WhatsApp
                            </Badge>
                          )}
                          <Badge
                            variant={
                              candidate.connectionStatus === 'connected'
                                ? 'default'
                                : candidate.connectionStatus === 'pending'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {candidate.connectionStatus}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="threads" className="space-y-2">
              {integration.messageThreads?.map((thread) => (
                <Card
                  key={thread.id}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => openChatThread(thread)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={thread.candidateAvatar} />
                          <AvatarFallback>{thread.candidateName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{thread.candidateName}</span>
                            {thread.channel === 'linkedin' ? (
                              <Linkedin className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <MessageCircle className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {thread.lastMessage}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={thread.status === 'unread' ? 'default' : 'outline'}>
                          {thread.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(thread.timestamp), 'MMM d, HH:mm')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Purchase Seats Modal */}
      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase Additional Seats</DialogTitle>
            <DialogDescription>
              Add more seats to enable messaging access for your team members
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Number of Seats</label>
              <Input
                type="number"
                min="1"
                value={seatsCount}
                onChange={(e) => setSeatsCount(parseInt(e.target.value) || 1)}
                className="mt-1"
              />
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Cost:</span>
              <span>${(seatsCount * 99).toFixed(2)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPurchaseModal(false)}>
              Cancel
            </Button>
            <Button onClick={handlePurchaseSeats}>
              <CreditCard className="w-4 h-4 mr-2" />
              Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Message Modal */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Message to Candidates</DialogTitle>
            <DialogDescription>
              Sending to {selectedCandidates.length} candidate(s)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Channel</label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={messageChannel === 'linkedin' ? 'default' : 'outline'}
                  onClick={() => setMessageChannel('linkedin')}
                  className="flex-1"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button
                  variant={messageChannel === 'whatsapp' ? 'default' : 'outline'}
                  onClick={() => setMessageChannel('whatsapp')}
                  className="flex-1"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Type your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={6}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Thread Modal */}
      <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedThread?.candidateAvatar} />
                <AvatarFallback>{selectedThread?.candidateName.charAt(0)}</AvatarFallback>
              </Avatar>
              {selectedThread?.candidateName}
              {selectedThread?.channel === 'linkedin' ? (
                <Linkedin className="w-4 h-4 text-muted-foreground" />
              ) : (
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
              )}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {(selectedThread?.messages || []).map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'employee' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === 'employee'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'employee'
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {format(new Date(message.timestamp), 'MMM d, HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Textarea placeholder="Type your reply..." rows={2} />
            <Button size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Seat Assignment Dialog */}
      <SeatAssignmentDialog
        open={showAssignmentModal}
        onOpenChange={setShowAssignmentModal}
        onAssign={handleAssignSeat}
        editMode={!!editingSeat}
        existingSeat={
          editingSeatData
            ? {
                employeeId: editingSeatData.employeeId,
                employeeName: editingSeatData.employeeName,
                permissionLevel: editingSeatData.permissionLevel || 'send_message',
                accessibleTags: editingSeatData.accessibleTags || [],
                notes: editingSeatData.notes,
              }
            : undefined
        }
      />
    </div>
  );
};
