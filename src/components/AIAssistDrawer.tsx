import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';

interface AIAssistDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetField: 'subject' | 'body';
  onInsert: (content: string) => void;
  category?: string;
}

const quickPrompts = [
  "Rewrite professionally",
  "Make it more friendly",
  "Create a new email template for this category",
  "Improve clarity",
];

export const AIAssistDrawer: React.FC<AIAssistDrawerProps> = ({
  open,
  onOpenChange,
  targetField,
  onInsert,
  category,
}) => {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  const handleGenerate = async (customPrompt?: string) => {
    setIsGenerating(true);
    const finalPrompt = customPrompt || prompt;
    
    // Simulate AI generation (replace with actual AI API call)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockContent = targetField === 'subject'
      ? `${category || 'Email'} Update - ${finalPrompt}`
      : `Dear {{candidateName}},\n\nWe are pleased to inform you about ${finalPrompt}.\n\nBest regards,\n{{senderName}}\n{{organizationName}}`;
    
    setGeneratedContent(mockContent);
    setEditedContent(mockContent);
    setIsGenerating(false);
  };

  const handleInsert = () => {
    onInsert(editedContent);
    onOpenChange(false);
    resetState();
  };

  const resetState = () => {
    setPrompt('');
    setGeneratedContent('');
    setEditedContent('');
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate Template Content
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="px-6 py-4 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">What would you like to generate?</label>
            <Textarea
              placeholder="Describe what you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Prompts</label>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((quickPrompt) => (
                <Button
                  key={quickPrompt}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerate(quickPrompt)}
                  disabled={isGenerating}
                >
                  {quickPrompt}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={() => handleGenerate()}
            disabled={!prompt || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>

          {generatedContent && (
            <Card className="p-4 space-y-3 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">AI Output</label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleGenerate()}
                  disabled={isGenerating}
                >
                  Regenerate
                </Button>
              </div>
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[150px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleInsert}
                  className="flex-1"
                >
                  Insert into {targetField === 'subject' ? 'Subject' : 'Body'}
                </Button>
              </div>
            </Card>
          )}
        </div>

        <DrawerFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
