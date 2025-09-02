'use client'

import { ExternalLink, Images } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { ImageResult } from './types'
import Image from 'next/image'
import { isValidImageUrl } from '@/lib/image-utils'
import { useState } from 'react'
import { ImageModal } from './image-modal'

interface ImageResultsProps {
  results: ImageResult[]
  isLoading: boolean
}

export function ImageResults({ results, isLoading }: ImageResultsProps) {
  const [selectedImage, setSelectedImage] = useState<{ url: string; title?: string } | null>(null)
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
          <Images className="h-4 w-4" />
          Images
        </h3>
        <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 overflow-x-auto gap-3 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="flex-shrink-0 w-[200px] sm:w-auto aspect-square animate-pulse bg-gray-200 dark:bg-zinc-700 border-gray-200 dark:border-gray-700" />
          ))}
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
        <Images className="h-4 w-4" />
        Images
      </h3>
      {/* Mobile: Horizontal scroll, Desktop: Grid */}
      <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 overflow-x-auto gap-3 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        {results.slice(0, 6).map((result, index) => (
          <div
            key={index}
            className="group block flex-shrink-0 w-[200px] sm:w-auto cursor-pointer"
            onClick={() => setSelectedImage({ url: result.thumbnail || '', title: result.title })}
          >
            <Card className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-md h-full">
              {result.thumbnail && isValidImageUrl(result.thumbnail) ? (
                <Image
                  src={result.thumbnail}
                  alt={result.title || 'Image'}
                  fill
                  className="object-cover"
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    const parent = target.parentElement
                    if (parent) {
                      parent.classList.add('bg-gray-200', 'dark:bg-zinc-700')
                    }
                    target.style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-zinc-700">
                  <Images className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-1 sm:p-2">
                  <p className="text-[10px] sm:text-xs text-white line-clamp-1 sm:line-clamp-2">{result.title || 'View image'}</p>
                  {result.source && (
                    <p className="text-[10px] sm:text-xs text-gray-300 mt-0.5 sm:mt-1 line-clamp-1">{result.source}</p>
                  )}
                </div>
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 rounded hover:bg-white/20 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </a>
              </div>
            </Card>
          </div>
        ))}
      </div>
      
      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage.url}
          title={selectedImage.title}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  )
}