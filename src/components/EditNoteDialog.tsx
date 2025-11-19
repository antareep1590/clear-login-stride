import { useState, useEffect } from 'react';
import { ClientNote } from '@/types/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EditNoteDialogProps {
  note: ClientNote;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateNote: (noteId: string, updates: Partial<ClientNote>) => void;
}

export function EditNoteDialog({ note, open, onOpenChange, onUpdateNote }: EditNoteDialogProps) {
  const [content, setContent] = useState(note.content);
  const [isPinned, setIsPinned] = useState(note.isPinned);
  const [category, setCategory] = useState<string>(note.category || '');
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    setContent(note.content);
    setIsPinned(note.isPinned);
    setCategory(note.category || '');
    setTags(note.tags || []);
  }, [note]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Note content is required',
        variant: 'destructive',
      });
      return;
    }

    if (content.length > 2000) {
      toast({
        title: 'Error',
        description: 'Note content must be less than 2000 characters',
        variant: 'destructive',
      });
      return;
    }

    onUpdateNote(note.id, {
      content: content.trim(),
      isPinned,
      category: category || undefined,
      tags: tags.length > 0 ? tags : undefined,
    });

    onOpenChange(false);

    toast({
      title: 'Success',
      description: 'Note updated successfully',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="content">
              Note Content *
              <span className="text-xs text-muted-foreground ml-2">
                {content.length}/2000
              </span>
            </Label>
            <Textarea
              id="content"
              placeholder="Enter your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] resize-y"
              maxLength={2000}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="important">Important</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" variant="secondary" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-destructive/20 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="pin"
              checked={isPinned}
              onCheckedChange={(checked) => setIsPinned(checked as boolean)}
            />
            <Label htmlFor="pin" className="text-sm font-normal cursor-pointer">
              Pin this note to the top
            </Label>
          </div>

          {note.updatedAt && (
            <p className="text-xs text-muted-foreground">
              Last edited: {new Date(note.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
