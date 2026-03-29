// src/components/admin/Autocomplete.tsx
"use client";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

export default function Autocomplete({ items, placeholder, value, onChange }: any) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = items.filter((i: any) => i.nome.toLowerCase().includes(search.toLowerCase()));
  const selected = items.find((i: any) => i.id === value);

  return (
    <div className="relative w-full">
      <div 
        onClick={() => setOpen(!open)}
        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold uppercase flex justify-between items-center cursor-pointer hover:bg-white transition-all"
      >
        {selected ? selected.nome : placeholder}
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>

      {open && (
        <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto p-2">
          <input 
            className="w-full p-2 mb-2 bg-gray-50 rounded-lg text-xs outline-none border border-gray-100"
            placeholder="Digite para filtrar..."
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          {filtered.map((item: any) => (
            <div 
              key={item.id}
              onClick={() => { onChange(item.id); setOpen(false); }}
              className="p-2 hover:bg-ipa-verde hover:text-white rounded-lg text-xs font-bold uppercase cursor-pointer flex justify-between items-center"
            >
              {item.nome}
              {value === item.id && <Check size={14} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}