"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  Heading1,
  Heading2,
  Heading3
} from "lucide-react";
import { Button } from "./button";
import { Separator } from "./separator";

interface RichEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichEditor({ content, onChange, placeholder }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm max-w-none",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1 p-1 border rounded-md bg-slate-50/50">
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          active={editor.isActive("bold")}
        >
          <Bold className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          active={editor.isActive("italic")}
        >
          <Italic className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleUnderline().run()} 
          active={editor.isActive("underline")}
        >
          <UnderlineIcon className="w-4 h-4" />
        </MenuButton>
        
        <Separator orientation="vertical" className="h-6 mx-1" />

        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
          active={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          active={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
          active={editor.isActive("heading", { level: 3 })}
        >
          <Heading3 className="w-4 h-4" />
        </MenuButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <MenuButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          active={editor.isActive("bulletList")}
        >
          <List className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          active={editor.isActive("orderedList")}
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          active={editor.isActive("blockquote")}
        >
          <Quote className="w-4 h-4" />
        </MenuButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className="w-4 h-4" />
        </MenuButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function MenuButton({ 
  onClick, 
  active = false, 
  disabled = false, 
  children 
}: { 
  onClick: () => void; 
  active?: boolean; 
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={`h-8 w-8 p-0 ${active ? "bg-slate-200 text-slate-900" : "text-slate-500"}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}
