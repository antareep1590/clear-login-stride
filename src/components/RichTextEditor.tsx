import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Link, Strikethrough, Quote, List, ListOrdered, IndentIncrease, IndentDecrease } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onAIAssistClick?: () => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  onAIAssistClick,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-input rounded-md overflow-hidden bg-background">
      <div className="flex items-center gap-1 p-2 border-b border-input bg-muted/30">
        <select
          className="px-2 py-1 text-sm border border-input rounded bg-background"
          onChange={(e) => execCommand('formatBlock', e.target.value)}
        >
          <option value="p">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <div className="h-6 w-px bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand('bold')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand('italic')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand('underline')}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) execCommand('createLink', url);
          }}
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand('strikeThrough')}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand('formatBlock', 'blockquote')}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="h-6 w-px bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand('insertUnorderedList')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand('insertOrderedList')}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand('indent')}
        >
          <IndentIncrease className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand('outdent')}
        >
          <IndentDecrease className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className={cn(
          "min-h-[120px] p-3 focus:outline-none prose prose-sm max-w-none",
          !value && "text-muted-foreground"
        )}
        data-placeholder={placeholder}
      />
      {onAIAssistClick && (
        <div className="p-2 border-t border-input">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAIAssistClick}
            className="text-xs"
          >
            ✨ Write with AI Assist
          </Button>
        </div>
      )}
    </div>
  );
};
