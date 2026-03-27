"use client";

import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const slides = [
  {
    title: "Sola Scriptura",
    description: "A autoridade final em matéria de fé e prática.",
    image: "https://images.unsplash.com/photo-1536704231234-beca9772ca68?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Bíblia Sagrada aberta representando o princípio Sola Scriptura na Igreja Presbiteriana de Aquiraz",
  },
  {
    title: "Soli Deo Gloria",
    description: "Criados para o louvor da glória de Deus.",
    image: "https://images.unsplash.com/photo-1586486942853-511cfe2c6313?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Natureza e criação divina representando Soli Deo Gloria",
  },
  {
    title: "Sola Fide",
    description: "A justificação é pela fé somente, um presente de Deus.",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Comunhão cristã representando a justificação pela fé",
  },
  {
    title: "Sola Christus",
    description: "Só há um mediador entre Deus e os homens, Jesus Cristo.",
    image: "https://images.unsplash.com/photo-1592818868295-f527dbac420d?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Cruz simbolizando a mediação exclusiva de Cristo",
  },
  {
    title: "Comunhão e Fé",
    description: "Uma família firmada na rocha que é Cristo.",
    image: "https://images.unsplash.com/photo-1606787503474-b28a4072fbc5?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Membros da igreja em comunhão fraterna",
  },
];

export default function HeroBanner() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  return (
    <div className="w-full relative">
      {/* O H1 fica FORA do container do Embla para não quebrar o script do carrossel */}
      <h1 className="sr-only">
        Igreja Presbiteriana de Aquiraz - Comunidade Cristã Confessional e Reformada no Ceará
      </h1>

      <section 
        className="embla overflow-hidden relative" 
        ref={emblaRef}
        aria-roledescription="carousel"
        aria-label="Banner de Destaques da Igreja Presbiteriana"
      >
        <div className="embla__container flex">
          {slides.map((slide, index) => (
            <div 
              className="embla__slide relative flex-[0_0_100%] min-w-0 h-[60vh] md:h-[85vh]" 
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${slides.length}`}
            >
              <div className="absolute inset-0 bg-black/50 z-10" aria-hidden="true" />
              
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                className="object-cover"
                priority={index === 0}
              />
              
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
                <h2 className="font-serif text-4xl md:text-7xl mb-4 animate-fade-in">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-2xl font-light max-w-2xl opacity-90">
                  {slide.description}
                </p>
                <div className="mt-8 h-1 w-24 bg-ipa-dourado rounded-full" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}