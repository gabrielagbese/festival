'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

interface Sponsor {
  name: string
  logo: string
}

interface SponsorCarouselProps {
  sponsors: Sponsor[]
}

export function SponsorCarousel({ sponsors }: SponsorCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scrollWidth = container.scrollWidth
    const clientWidth = container.clientWidth

    let scrollPosition = 0
    const scrollSpeed = 0.5 // Adjust this value to change the scroll speed

    const scroll = () => {
      scrollPosition += scrollSpeed
      if (scrollPosition >= scrollWidth / 2) {
        scrollPosition = 0
      }
      container.scrollLeft = scrollPosition
      requestAnimationFrame(scroll)
    }

    const animation = requestAnimationFrame(scroll)

    return () => cancelAnimationFrame(animation)
  }, [sponsors])

  return (
    <div className="overflow-hidden" style={{ maxWidth: '100%' }}>
      <div
        ref={containerRef}
        className="flex whitespace-nowrap"
        style={{ width: `${sponsors.length * 200}px` }}
      >
        {[...sponsors, ...sponsors].map((sponsor, index) => (
          <div key={index} className="inline-block w-48 h-32 mx-4">
            <Image
              src={sponsor.logo || "/placeholder.svg"}
              alt={sponsor.name}
              width={192}
              height={128}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

