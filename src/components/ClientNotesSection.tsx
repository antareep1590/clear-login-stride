import { useState } from 'react';
import { ClientNote } from '@/types/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Pin, Edit, Trash2, Clock } from 'lucide-react';
import { AddNoteDialog } from './AddNoteDialog';
import { EditNoteDialog } from './EditNoteDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ClientNotesSectionProps {
  notes: ClientNote[];
  onAddNote: (note: Omit<ClientNote, 'id' | 'createdAt'>) => void;
  onUpdateNote: (noteId: string, updates: Partial<ClientNote>) => void;
  onDeleteNote: (noteId: string) => void;
  onPinNote: (noteId: string, isPinned: boolean) => void;
}

export function ClientNotesSection({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onPinNote,
}: ClientNotesSectionProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<ClientNote | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  };

  const toggleExpand = (noteId: string) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            Notes
            {notes.length > 0 && (
              <Badge variant="secondary">{notes.length}</Badge>
            )}
          </CardTitle>
          <Button onClick={() => setShowAddDialog(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No notes yet. Add your first note to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedNotes.map(note => {
                const isExpanded = expandedNotes.has(note.id);
                const shouldTruncate = note.content.length > 200;
                const displayContent = isExpanded || !shouldTruncate
                  ? note.content
                  : note.content.slice(0, 200) + '...';

                return (
                  <Card
                    key={note.id}
                    className={note.isPinned ? 'border-primary bg-accent/5' : ''}
                  >
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {note.authorName
                              .split(' ')
                              .map(n => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm">{note.authorName}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{getRelativeTime(note.createdAt)}</span>
                                {note.updatedAt && (
                                  <span className="text-xs">(edited)</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onPinNote(note.id, !note.isPinned)}
                              >
                                <Pin
                                  className={`h-4 w-4 ${note.isPinned ? 'fill-primary text-primary' : ''}`}
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setEditingNote(note)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => setDeletingNoteId(note.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{displayContent}</p>
                          {shouldTruncate && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0"
                              onClick={() => toggleExpand(note.id)}
                            >
                              {isExpanded ? 'Show less' : 'Show more'}
                            </Button>
                          )}
                          {(note.tags || note.category) && (
                            <div className="flex flex-wrap gap-2">
                              {note.category && (
                                <Badge variant="outline">{note.category}</Badge>
                              )}
                              {note.tags?.map(tag => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AddNoteDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddNote={onAddNote}
      />

      {editingNote && (
        <EditNoteDialog
          note={editingNote}
          open={!!editingNote}
          onOpenChange={(open) => !open && setEditingNote(null)}
          onUpdateNote={onUpdateNote}
        />
      )}

      <AlertDialog open={!!deletingNoteId} onOpenChange={(open) => !open && setDeletingNoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingNoteId) {
                  onDeleteNote(deletingNoteId);
                  setDeletingNoteId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
