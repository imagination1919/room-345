"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

type Slide = {
  src: string
  alt: string
}

const SLIDES: Slide[] = [
  { src: "/hero-slides/slide-1.jpg", alt: "A dog running happily down a leaf-covered forest path" },
  { src: "/hero-slides/slide-2.jpg", alt: "A dog and a cat lying together in the grass" },
  { src: "/hero-slides/slide-3.jpg", alt: "A dog resting with a tabby cat on a tiled floor" },
  { src: "/hero-slides/slide-4.jpg", alt: "A silver tabby cat perched in a window" },
  { src: "/hero-slides/slide-5.jpg", alt: "A cat looking out a window" },
  { src: "/hero-slides/slide-6.jpg", alt: "Two dogs standing together in grass" },
  { src: "/hero-slides/slide-7.jpg", alt: "A school of goldfish in a planted aquarium" },
  { src: "/hero-slides/slide-8.jpg", alt: "A close-up portrait of a pet bearded dragon" },
]

const SLIDE_DURATION_MS = 5000

export default function HeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    // A decorative, auto-rotating carousel can be uncomfortable for
    // vestibular-sensitive users — freeze on the first slide instead of
    // auto-advancing when the OS asks for reduced motion.
    if (prefersReducedMotion) {
      return
    }

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDES.length)
    }, SLIDE_DURATION_MS)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative aspect-[4/3] w-full rounded-large overflow-hidden">
      {SLIDES.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={index === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  )
}
