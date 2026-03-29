// src/components/admin/EditorNoticia.tsx
"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, Italic, List, Quote, Youtube as YoutubeIcon, 
  Heading1, Heading2, BookOpen, Code, Layout, Columns
} from 'lucide-react';
import { useState } from 'react';

const EditorNoticia = ({ value, onChange }: { value: string, onChange: (html: string) => void }) => {
  const [showHtml, setShowHtml] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Youtube.configure({ width: 480, height: 270 }),
      Placeholder.configure({ placeholder: 'Conteúdo da notícia...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: 'prose prose-sm focus:outline-none min-h-[500px] max-w-none p-6 text-ipa-escuro' } },
  });

  if (!editor) return null;

  // Templates de Grids Responsivos
  const addGrid = (cols: number) => {
    const content = cols === 1 
      ? `<div class="w-full p-4 border border-gray-100 rounded-xl mb-4">Conteúdo 100% largura</div>`
      : `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="p-4 border border-gray-100 rounded-xl">Coluna 1</div>
          <div class="p-4 border border-gray-100 rounded-xl">Coluna 2</div>
         </div>`;
    editor.chain().focus().insertContent(content).run();
  };

  return (
    <div className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-50 border-b border-gray-100 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="p-2 hover:bg-white rounded"><Bold size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()} className="p-2 hover:bg-white rounded"><Heading2 size={18} /></button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button type="button" onClick={() => addGrid(1)} className="p-2 text-gray-500 hover:bg-white rounded" title="Grid 1 Coluna"><Layout size={18} /></button>
        <button type="button" onClick={() => addGrid(2)} className="p-2 text-gray-500 hover:bg-white rounded" title="Grid 2 Colunas"><Columns size={18} /></button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button type="button" onClick={() => setShowHtml(!showHtml)} className={`p-2 rounded ${showHtml ? 'bg-ipa-verde text-white' : 'text-gray-400'}`}>
          <Code size={18} />
        </button>
      </div>

      {showHtml ? (
        <textarea 
          className="w-full h-[500px] p-6 font-mono text-sm bg-gray-900 text-green-400 focus:outline-none"
          value={editor.getHTML()}
          onChange={(e) => editor.commands.setContent(e.target.value)}
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
};
export default EditorNoticia;