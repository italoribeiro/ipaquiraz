"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, Italic, List, ListOrdered, Quote, 
  Link as LinkIcon, Youtube as YoutubeIcon, 
  Heading1, Heading2, Type, BookOpen
} from 'lucide-react';

const EditorNoticia = ({ value, onChange }: { value: string, onChange: (html: string) => void }) => {
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
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[500px] max-w-none p-4',
      },
    },
  });

  if (!editor) return null;

  // TEMPLATES DE ESTRUTURA (Conceito WordPress Blocks)
  const inserirTemplateCitacao = () => {
    editor.chain().focus().insertContent(`
      <blockquote class="border-l-4 border-ipa-dourado pl-4 italic my-4 text-gray-600 bg-gray-50 p-4 rounded-r-lg">
        "Insira aqui a citação de um reformador (ex: João Calvino)..."
        <cite class="block mt-2 font-bold text-ipa-verde">— Nome do Autor</cite>
      </blockquote>
    `).run();
  };

  const inserirTemplateVersiculo = () => {
    editor.chain().focus().insertContent(`
      <div class="bg-ipa-verde/5 border-2 border-ipa-verde/20 p-6 rounded-2xl my-6 text-center italic">
        <p class="text-lg text-ipa-escuro font-serif">"Pois pela graça sois salvos, por meio da fé..."</p>
        <span class="block mt-3 text-[10px] font-black uppercase tracking-widest text-ipa-verde">— Efésios 2:8</span>
      </div>
    `).run();
  };

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* TOOLBAR ESTILO WORDPRESS */}
      <div className="bg-gray-50 border-b border-gray-100 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded hover:bg-white ${editor.isActive('heading', { level: 1 }) ? 'text-ipa-verde bg-white shadow-sm' : 'text-gray-400'}`} title="Título Grande"><Heading1 size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-white ${editor.isActive('heading', { level: 2 }) ? 'text-ipa-verde bg-white shadow-sm' : 'text-gray-400'}`} title="Subtítulo"><Heading2 size={18} /></button>
        <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-white ${editor.isActive('bold') ? 'text-ipa-verde bg-white shadow-sm' : 'text-gray-400'}`}><Bold size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-white ${editor.isActive('italic') ? 'text-ipa-verde bg-white shadow-sm' : 'text-gray-400'}`}><Italic size={18} /></button>
        <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-white ${editor.isActive('bulletList') ? 'text-ipa-verde bg-white shadow-sm' : 'text-gray-400'}`}><List size={18} /></button>
        <button type="button" onClick={inserirTemplateCitacao} className="p-2 text-ipa-dourado hover:bg-ipa-dourado/10 rounded flex items-center gap-1 text-[10px] font-black uppercase"><Quote size={14} /> Citação</button>
        <button type="button" onClick={inserirTemplateVersiculo} className="p-2 text-ipa-verde hover:bg-ipa-verde/10 rounded flex items-center gap-1 text-[10px] font-black uppercase"><BookOpen size={14} /> Versículo</button>
        <button type="button" onClick={() => {
          const url = prompt('URL do vídeo do YouTube');
          if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
        }} className="p-2 text-red-500 hover:bg-red-50 rounded"><YoutubeIcon size={18} /></button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default EditorNoticia;