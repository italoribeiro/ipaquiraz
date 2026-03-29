"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Youtube } from '@tiptap/extension-youtube';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Placeholder } from '@tiptap/extension-placeholder';
import { 
  Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, 
  Table as TableIcon, Quote, Youtube as YoutubeIcon, Code, BookOpen, 
  Columns, Layout, ChevronDown, List, Heading2
} from 'lucide-react';
import { useState } from 'react';

const EditorNoticia = ({ value, onChange }: { value: string, onChange: (html: string) => void }) => {
  const [showHtml, setShowHtml] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] }
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: true }),
      TableRow, 
      TableHeader, 
      TableCell,
      Youtube.configure({ width: 480, height: 270 }),
      Placeholder.configure({ placeholder: 'Comece seu artigo reformado aqui...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-sm lg:prose-base focus:outline-none min-h-[600px] max-w-none p-8 text-ipa-escuro shadow-inner bg-white',
      },
    },
  });

  if (!editor) return null;

  // CORREÇÃO: Usando updateAttributes para aplicar classes CSS personalizadas
  const aplicarEstilo = (classe: string) => {
    editor.chain().focus().updateAttributes('paragraph', { class: classe }).run();
  };

  const addTable = () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();

  // Template da Citação flutuante (conforme a imagem que você enviou)
  const inserirPullQuote = () => {
    editor.chain().focus().insertContent(`
      <div class="float-right w-full md:w-1/3 ml-0 md:ml-8 mb-6 p-8 border-t-2 border-b-2 border-gray-100 text-2xl font-serif italic text-ipa-escuro leading-relaxed text-center md:text-left">
        "Insira aqui a frase de impacto que o texto irá contornar..."
      </div>
    `).run();
  };

  return (
    <div className="border border-gray-100 rounded-[32px] overflow-hidden bg-white shadow-xl font-sans">
      {/* TOOLBAR SUPER COMPLETA */}
      <div className="bg-gray-50/80 backdrop-blur-md border-b border-gray-100 p-3 flex flex-wrap gap-2 sticky top-0 z-20 items-center">
        
        {/* COMBOBOX DE ESTILOS CSS */}
        <div className="relative group">
          <button type="button" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-ipa-verde hover:border-ipa-verde transition-all shadow-sm">
            Estilos Visuais <ChevronDown size={14} />
          </button>
          <div className="absolute hidden group-hover:block top-full left-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-50">
            <button type="button" onClick={() => editor.chain().focus().setParagraph().updateAttributes('paragraph', { class: '' }).run()} className="w-full text-left p-2.5 hover:bg-gray-50 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-400">Texto Padrão</button>
            <button type="button" onClick={inserirPullQuote} className="w-full text-left p-2.5 hover:bg-ipa-verde/10 rounded-lg text-[10px] font-bold text-ipa-verde uppercase tracking-wider">Pull Quote (Igual Imagem)</button>
            <button type="button" onClick={() => aplicarEstilo('bg-ipa-verde text-white p-8 rounded-3xl shadow-xl font-serif text-xl')} className="w-full text-left p-2.5 hover:bg-gray-50 rounded-lg text-[10px] font-bold uppercase tracking-wider">Box Destaque IP Aquiraz</button>
            <button type="button" onClick={() => aplicarEstilo('border-l-4 border-ipa-dourado pl-6 py-2 italic text-gray-500 bg-gray-50 rounded-r-xl')} className="w-full text-left p-2.5 hover:bg-gray-50 rounded-lg text-[10px] font-bold uppercase tracking-wider text-ipa-dourado">Citação Teológica</button>
          </div>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* FORMATAÇÃO BÁSICA */}
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-lg transition-all ${editor.isActive('bold') ? 'bg-ipa-verde text-white' : 'text-gray-400 hover:bg-gray-50'}`}><Bold size={16} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded-lg transition-all ${editor.isActive('underline') ? 'bg-ipa-verde text-white' : 'text-gray-400 hover:bg-gray-50'}`}><UnderlineIcon size={16} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-lg transition-all ${editor.isActive('italic') ? 'bg-ipa-verde text-white' : 'text-gray-400 hover:bg-gray-50'}`}><Italic size={16} /></button>
        </div>
        
        {/* ALINHAMENTO */}
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded-lg transition-all ${editor.isActive({ textAlign: 'left' }) ? 'bg-ipa-verde text-white' : 'text-gray-400 hover:bg-gray-50'}`}><AlignLeft size={16} /></button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded-lg transition-all ${editor.isActive({ textAlign: 'center' }) ? 'bg-ipa-verde text-white' : 'text-gray-400 hover:bg-gray-50'}`}><AlignCenter size={16} /></button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded-lg transition-all ${editor.isActive({ textAlign: 'right' }) ? 'bg-ipa-verde text-white' : 'text-gray-400 hover:bg-gray-50'}`}><AlignRight size={16} /></button>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* TABELAS E MÍDIA */}
        <button type="button" onClick={addTable} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:border-ipa-verde hover:text-ipa-verde transition-all shadow-sm" title="Inserir Tabela"><TableIcon size={18} /></button>
        <button type="button" onClick={() => {
          const url = prompt('URL do vídeo do YouTube');
          if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
        }} className="p-2.5 bg-white border border-gray-200 rounded-xl text-red-500 hover:bg-red-50 transition-all shadow-sm"><YoutubeIcon size={18} /></button>

        {/* MODO CÓDIGO HTML */}
        <button type="button" onClick={() => setShowHtml(!showHtml)} className={`p-2.5 rounded-xl ml-auto transition-all shadow-sm ${showHtml ? 'bg-ipa-escuro text-white border-ipa-escuro' : 'bg-white border border-gray-200 text-gray-400 hover:text-ipa-verde'}`}>
          <Code size={18} />
        </button>
      </div>

      {showHtml ? (
        <textarea 
          className="w-full h-[600px] p-8 font-mono text-sm bg-gray-900 text-ipa-verde focus:outline-none leading-relaxed border-none"
          value={editor.getHTML()}
          onChange={(e) => editor.commands.setContent(e.target.value)}
        />
      ) : (
        <div className="bg-white">
          <EditorContent editor={editor} />
        </div>
      )}
    </div>
  );
};

export default EditorNoticia;