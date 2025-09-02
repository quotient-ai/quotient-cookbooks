'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'

interface ImageModalProps {
  imageUrl: string
  title?: string
  isOpen: boolean
  onClose: () => void
}

export function ImageModal({ imageUrl, title, isOpen, onClose }: ImageModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-[90vw] max-h-[90vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:-right-12 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-6 w-6 text-white" />
        </button>
        
        <div className="relative rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
          <Image
            src={imageUrl}
            alt={title || 'Image'}
            width={1200}
            height={800}
            className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
            unoptimized
            priority
          />
          
          {title && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-sm">{title}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}