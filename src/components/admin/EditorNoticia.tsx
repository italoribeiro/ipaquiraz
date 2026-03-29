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

// Importando as extensões de Tabela
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

import { 
  Bold, Italic, Underline as UnderlineIcon, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Youtube as YoutubeIcon, Image as ImageIcon,
  Heading2, Code, Layout, Columns
} from 'lucide-react';
import { useState, useEffect } from 'react';

const EditorNoticia = ({ value, onChange }: { value: string, onChange: (html: string) => void }) => {
  const [showHtml, setShowHtml] = useState(false);
  const [htmlValue, setHtmlValue] = useState(""); // Estado independente para o modo código

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Youtube.configure({ width: 480, height: 270, HTMLAttributes: { class: 'rounded-lg w-full max-w-2xl mx-auto' } }),
      Placeholder.configure({ placeholder: 'Conteúdo da notícia...' }),
      
      // Configurando as Tabelas para não serem deletadas
      Table.configure({ resizable: true, HTMLAttributes: { class: 'w-full border-collapse border border-gray-200 my-4' } }),
      TableRow.configure({ HTMLAttributes: { class: 'border-b border-gray-200' } }),
      TableHeader.configure({ HTMLAttributes: { class: 'bg-gray-50 p-3 text-left font-bold border border-gray-200' } }),
      TableCell.configure({ HTMLAttributes: { class: 'p-3 border border-gray-200' } }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      // Só atualiza o form pai pelo Tiptap se NÃO estivermos no modo HTML
      if (!showHtml) {
        onChange(editor.getHTML());
      }
    },
    editorProps: { attributes: { class: 'prose prose-sm focus:outline-none min-h-[500px] max-w-none p-6 text-ipa-escuro' } },
  });

  // Função que gerencia a troca de visualização
  const toggleHtmlView = () => {
    if (showHtml) {
      // Saindo do HTML -> Voltando para o Visual
      // Pega o que foi digitado na textarea e joga pro Tiptap
      editor?.commands.setContent(htmlValue);
      onChange(htmlValue); // Garante que o form pai receba a última versão
      setShowHtml(false);
    } else {
      // Saindo do Visual -> Indo para o HTML
      // Pega o conteúdo atual do Tiptap e joga na textarea
      setHtmlValue(editor?.getHTML() || "");
      setShowHtml(true);
    }
  };

  if (!editor) return null;

  const addGrid = (cols: number) => {
    const content = cols === 1 
      ? `<div class="w-full p-4 border border-gray-100 rounded-xl mb-4">Conteúdo 100% largura</div>`
      : `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="p-4 border border-gray-100 rounded-xl">Coluna 1</div>
          <div class="p-4 border border-gray-100 rounded-xl">Coluna 2</div>
         </div>`;
    editor.chain().focus().insertContent(content).run();
  };

  const addImage = () => {
    const url = window.prompt('URL da Imagem:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('URL do vídeo do YouTube:');
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const btnClass = (isActive: boolean) => 
    `p-2 rounded transition-colors ${isActive ? 'bg-gray-200 text-black' : 'text-gray-600 hover:bg-gray-100'}`;

  return (
    <div className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-50 border-b border-gray-100 p-2 flex flex-wrap items-center gap-1 sticky top-0 z-10">
        
        {/* Botões ficam desativados visualmente quando no modo HTML para evitar conflito */}
        <div className={`flex flex-wrap items-center gap-1 ${showHtml ? 'opacity-50 pointer-events-none' : ''}`}>
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}><Bold size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}><Italic size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))}><UnderlineIcon size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}><Heading2 size={18} /></button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))}><AlignLeft size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))}><AlignCenter size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))}><AlignRight size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={btnClass(editor.isActive({ textAlign: 'justify' }))}><AlignJustify size={18} /></button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button type="button" onClick={addImage} className="p-2 text-gray-600 hover:bg-gray-100 rounded"><ImageIcon size={18} /></button>
          <button type="button" onClick={addYoutubeVideo} className="p-2 text-gray-600 hover:bg-gray-100 rounded"><YoutubeIcon size={18} /></button>
          <button type="button" onClick={() => addGrid(1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded"><Layout size={18} /></button>
          <button type="button" onClick={() => addGrid(2)} className="p-2 text-gray-600 hover:bg-gray-100 rounded"><Columns size={18} /></button>
        </div>
        
        <div className="w-px h-6 bg-gray-300 mx-1 ml-auto" />
        
        {/* Toggle HTML */}
        <button 
          type="button" 
          onClick={toggleHtmlView} 
          className={`p-2 rounded flex items-center gap-1 ${showHtml ? 'bg-ipa-verde text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <Code size={18} />
          <span className="text-xs font-semibold uppercase">{showHtml ? 'Visual' : 'HTML'}</span>
        </button>
      </div>

      {showHtml ? (
        <textarea 
          className="w-full h-[500px] p-6 font-mono text-sm bg-gray-900 text-green-400 focus:outline-none"
          value={htmlValue}
          onChange={(e) => {
            setHtmlValue(e.target.value); // Atualiza só a textarea
            onChange(e.target.value);     // Avisa o form principal, sem quebrar o Tiptap
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