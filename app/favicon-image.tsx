'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Globe } from 'lucide-react'

interface FaviconImageProps {
  src?: string
  alt?: string
  size?: number
  className?: string
}

export function FaviconImage({ src, alt = '', size = 16, className = '' }: FaviconImageProps) {
  const [error, setError] = useState(false)
  
  if (!src) {
    return (
      <Globe className={`h-${size/4} w-${size/4} text-gray-400 ${className}`} />
    )
  }
  
  return (
    <div className={`relative inline-block ${className}`}>
      {error && (
        <Globe className={`h-${size/4} w-${size/4} text-gray-400`} />
      )}
      {!error && (
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="w-full h-full"
          onError={() => {
            setError(true)
          }}
          unoptimized // Skip Next.js optimization for favicons
          loading="lazy" // Lazy load to reduce initial requests
        />
      )}
    </div>
  )
}