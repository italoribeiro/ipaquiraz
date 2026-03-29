// src/components/admin/EditorNoticia.tsx
"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Youtube as YoutubeIcon, Image as ImageIcon,
  Heading2, Code, Layout, Columns
} from 'lucide-react';
import { useState } from 'react';

const EditorNoticia = ({ value, onChange }: { value: string, onChange: (html: string) => void }) => {
  const [showHtml, setShowHtml] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({ openOnClick: false }),
      Youtube.configure({ width: 480, height: 270, HTMLAttributes: { class: 'rounded-lg w-full max-w-2xl mx-auto' } }),
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

  // Funções para adicionar Mídia
  const addImage = () => {
    const url = window.prompt('URL da Imagem:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('URL do vídeo do YouTube (ex: https://www.youtube.com/watch?v=...):');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  // Estilo base para botões ativos/inativos
  const btnClass = (isActive: boolean) => 
    `p-2 rounded transition-colors ${isActive ? 'bg-gray-200 text-black' : 'text-gray-600 hover:bg-gray-100'}`;

  return (
    <div className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-50 border-b border-gray-100 p-2 flex flex-wrap items-center gap-1 sticky top-0 z-10">
        
        {/* Formatação de Texto */}
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Negrito"><Bold size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Itálico"><Italic size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))} title="Sublinhado"><UnderlineIcon size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()} className={btnClass(editor.isActive('heading', { level: 2 }))} title="Título 2"><Heading2 size={18} /></button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alinhamento */}
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))} title="Alinhar à Esquerda"><AlignLeft size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))} title="Centralizar"><AlignCenter size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))} title="Alinhar à Direita"><AlignRight size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={btnClass(editor.isActive({ textAlign: 'justify' }))} title="Justificar"><AlignJustify size={18} /></button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Mídia e Grids */}
        <button type="button" onClick={addImage} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Adicionar Imagem"><ImageIcon size={18} /></button>
        <button type="button" onClick={addYoutubeVideo} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Adicionar YouTube"><YoutubeIcon size={18} /></button>
        <button type="button" onClick={() => addGrid(1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Grid 1 Coluna"><Layout size={18} /></button>
        <button type="button" onClick={() => addGrid(2)} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Grid 2 Colunas"><Columns size={18} /></button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Toggle HTML */}
        <button 
          type="button" 
          onClick={() => setShowHtml(!showHtml)} 
          className={`p-2 rounded flex items-center gap-1 ml-auto ${showHtml ? 'bg-ipa-verde text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Ver/Editar Código HTML"
        >
          <Code size={18} />
          <span className="text-xs font-semibold uppercase">{showHtml ? 'Visual' : 'HTML'}</span>
        </button>
      </div>

      {showHtml ? (
        <textarea 
          className="w-full h-[500px] p-6 font-mono text-sm bg-gray-900 text-green-400 focus:outline-none"
          value={editor.getHTML()}
          onChange={(e) => {
            // Atualiza o Tiptap internamente
            editor.commands.setContent(e.target.value);
            // Avisa o componente pai (o formulário) que mudou
            onChange(e.target.value);
          }}
          placeholder="Cole ou digite seu código HTML aqui..."
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
};
export default EditorNoticia;