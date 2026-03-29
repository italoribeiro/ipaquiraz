"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, Italic, List, Quote, Youtube as YoutubeIcon, 
  Heading1, Heading2, BookOpen, Code, Layout, Columns, Type
} from 'lucide-react';
import { useState } from 'react';

const EditorNoticia = ({ value, onChange }: { value: string, onChange: (html: string) => void }) => {
  const [showHtml, setShowHtml] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Youtube.configure({ width: 480, height: 270 }),
      Placeholder.configure({ placeholder: 'Comece a escrever a notícia ou estudo bíblico...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none min-h-[500px] max-w-none p-6 text-ipa-escuro',
      },
    },
  });

  if (!editor) return null;

  // TEMPLATES DE ESTRUTURA
  const inserirTemplateCitacao = () => {
    editor.chain().focus().insertContent(`
      <blockquote class="border-l-4 border-ipa-dourado pl-4 italic my-4 text-gray-600 bg-gray-50 p-4 rounded-r-lg">
        "Insira aqui a citação de um reformador..."
        <cite class="block mt-2 font-bold text-ipa-verde">— Nome do Autor</cite>
      </blockquote>
    `).run();
  };

  const inserirTemplateVersiculo = () => {
    editor.chain().focus().insertContent(`
      <div class="bg-ipa-verde/5 border-2 border-ipa-verde/20 p-6 rounded-2xl my-6 text-center italic">
        <p class="text-lg text-ipa-escuro font-serif">"Texto do Versículo..."</p>
        <span class="block mt-3 text-[10px] font-black uppercase tracking-widest text-ipa-verde">— Referência Bíblica</span>
      </div>
    `).run();
  };

  const addGrid = (cols: number) => {
    const content = cols === 1 
      ? `<div class="w-full p-4 border border-gray-100 rounded-xl mb-4 text-center">Bloco 100%</div>`
      : `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="p-4 border border-gray-100 rounded-xl text-center">Coluna 1</div>
          <div class="p-4 border border-gray-100 rounded-xl text-center">Coluna 2</div>
         </div>`;
    editor.chain().focus().insertContent(content).run();
  };

  return (
    <div className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-50 border-b border-gray-100 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-white ${editor.isActive('bold') ? 'text-ipa-verde bg-white shadow-sm' : 'text-gray-400'}`}><Bold size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-white ${editor.isActive('heading', { level: 2 }) ? 'text-ipa-verde bg-white shadow-sm' : 'text-gray-400'}`}><Heading2 size={18} /></button>
        
        <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
        
        <button type="button" onClick={inserirTemplateCitacao} className="p-2 text-ipa-dourado hover:bg-white rounded flex items-center gap-1 text-[10px] font-black uppercase"><Quote size={14} /> Citação</button>
        <button type="button" onClick={inserirTemplateVersiculo} className="p-2 text-ipa-verde hover:bg-white rounded flex items-center gap-1 text-[10px] font-black uppercase"><BookOpen size={14} /> Versículo</button>
        
        <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

        <button type="button" onClick={() => addGrid(1)} className="p-2 text-gray-400 hover:bg-white rounded"><Layout size={18} /></button>
        <button type="button" onClick={() => addGrid(2)} className="p-2 text-gray-400 hover:bg-white rounded"><Columns size={18} /></button>

        <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

        <button type="button" onClick={() => {
          const url = prompt('URL do vídeo do YouTube');
          if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
        }} className="p-2 text-red-500 hover:bg-white rounded"><YoutubeIcon size={18} /></button>
        
        <button type="button" onClick={() => setShowHtml(!showHtml)} className={`p-2 rounded ml-auto ${showHtml ? 'bg-ipa-verde text-white' : 'text-gray-400 hover:bg-white'}`}>
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