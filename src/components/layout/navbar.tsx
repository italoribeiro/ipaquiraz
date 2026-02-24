"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'QUEM SOMOS', href: '/quem-somos' },
    { name: 'AGENDA', href: '/programacao' },
    { name: 'ENSINO', href: '/ensino' },
    { name: 'DÍZIMOS', href: '/dizimos' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? "bg-ipa-creme py-3 shadow-md" : "bg-ipa-verde py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Nome IP AQUIRAZ com Tipografia Moderna */}
        <Link href="/" className="group">
          <span className={`text-2xl font-light tracking-[0.3em] transition-colors duration-500 ${
            isScrolled ? "text-ipa-verde" : "text-white"
          }`}>
            IP <span className="font-bold uppercase">Aquiraz</span>
          </span>
        </Link>

        {/* Desktop Menu - Cores Alternáveis */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`text-[11px] font-bold tracking-[0.2em] transition-colors duration-500 hover:text-ipa-dourado ${
                isScrolled ? "text-ipa-dourado" : "text-white/90"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="/visita" 
            className={`px-7 py-2 rounded-full text-[11px] font-bold tracking-[0.2em] transition-all duration-500 border ${
              isScrolled 
                ? "border-ipa-dourado text-ipa-dourado hover:bg-ipa-dourado hover:text-white" 
                : "border-white/30 text-white bg-white/10 hover:bg-white hover:text-ipa-verde"
            }`}
          >
            VISITE-NOS
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <X size={28} className={isScrolled ? "text-ipa-verde" : "text-white"} />
          ) : (
            <Menu size={28} className={isScrolled ? "text-ipa-verde" : "text-white"} />
          )}
        </button>
      </div>

      {/* Menu Mobile Overlay */}
      <div className={`fixed inset-0 bg-ipa-verde transition-transform duration-500 ease-in-out md:hidden flex flex-col items-center justify-center gap-8 z-40 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <button className="absolute top-8 right-6 text-white" onClick={() => setIsOpen(false)}>
          <X size={32} />
        </button>
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href} 
            onClick={() => setIsOpen(false)}
            className="text-xl font-bold tracking-[0.2em] text-white hover:text-ipa-dourado"
          >
            {link.name}
          </Link>
        ))}
        <Link href="/visita" onClick={() => setIsOpen(false)} className="bg-ipa-dourado text-ipa-verde px-10 py-4 rounded-full font-bold">
          VISITE-NOS
        </Link>
      </div>
    </nav>
  );
}