import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/RichTextEditor';
import { AIAssistDrawer } from '@/components/AIAssistDrawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (template: {
    title: string;
    subject: string;
    body: string;
    category: string;
  }) => void;
}

const templateVariables = [
  '{{candidateName}}',
  '{{organizationName}}',
  '{{senderName}}',
  '{{senderEmail}}',
  '{{senderPhone}}',
];

export const AddTemplateDialog: React.FC<AddTemplateDialogProps> = ({
  open,
  onOpenChange,
  onAdd,
}) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [aiAssistOpen, setAiAssistOpen] = useState(false);
  const [aiTargetField, setAiTargetField] = useState<'subject' | 'body'>('subject');

  const handleSubmit = () => {
    if (!title || !category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onAdd({ title, subject, body, category });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setTitle('');
    setSubject('');
    setBody('');
    setCategory('');
  };

  const copyVariable = (variable: string) => {
    navigator.clipboard.writeText(variable);
    toast({
      title: "Copied!",
      description: `${variable} copied to clipboard`,
    });
  };

  const handleAIInsert = (content: string) => {
    if (aiTargetField === 'subject') {
      setSubject(content);
    } else {
      setBody(content);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Add Template</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
            <div className="grid grid-cols-[1fr,300px] gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Template Name<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter template name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subject</Label>
                  <RichTextEditor
                    value={subject}
                    onChange={setSubject}
                    placeholder="Enter subject"
                    onAIAssistClick={() => {
                      setAiTargetField('subject');
                      setAiAssistOpen(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category<span className="text-destructive">*</span>
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Applicant">Applicant</SelectItem>
                      <SelectItem value="Candidate">Candidate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Body</Label>
                  <RichTextEditor
                    value={body}
                    onChange={setBody}
                    placeholder="Enter email body"
                    onAIAssistClick={() => {
                      setAiTargetField('body');
                      setAiAssistOpen(true);
                    }}
                  />
                </div>
              </div>

              <div>
                <Card className="p-4">
                  <h3 className="text-sm font-semibold mb-3">Template Options</h3>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {templateVariables.map((variable) => (
                        <div
                          key={variable}
                          className="flex items-center justify-between p-2 rounded hover:bg-accent cursor-pointer group"
                          onClick={() => copyVariable(variable)}
                        >
                          <span className="text-sm text-muted-foreground">{variable}</span>
                          <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AIAssistDrawer
        open={aiAssistOpen}
        onOpenChange={setAiAssistOpen}
        targetField={aiTargetField}
        onInsert={handleAIInsert}
        category={category}
      />
    </>
  );
};
