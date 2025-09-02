'use client'

import { Calendar, ExternalLink, Newspaper } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { NewsResult } from './types'
import Image from 'next/image'
import { isValidImageUrl } from '@/lib/image-utils'

interface NewsResultsProps {
  results: NewsResult[]
  isLoading: boolean
}

export function NewsResults({ results, isLoading }: NewsResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
          <Newspaper className="h-4 w-4" />
          News
        </h3>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-3 animate-pulse bg-white dark:bg-zinc-800 border-gray-200 dark:border-gray-700">
            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-full"></div>
          </Card>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div className="space-y-3 relative">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
        <Newspaper className="h-4 w-4" />
        News
      </h3>
      {/* Mobile: Horizontal scroll, Desktop: Vertical stack */}
      <div className="sm:space-y-2 sm:block flex overflow-x-auto gap-3 pb-2 sm:mx-0 sm:px-0 scrollbar-hide">
        {results.slice(0, 5).map((result, index) => (
          <a
            key={index}
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block flex-shrink-0 w-[280px] sm:w-auto"
          >
            <Card className="p-3 bg-white dark:bg-zinc-800 border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-200 hover:shadow-md h-full">
            <div className="flex gap-3">
              {result.image && isValidImageUrl(result.image) && (
                <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-zinc-700">
                  <Image
                    src={result.image}
                    alt={result.title}
                    fill
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 mb-1">
                  {result.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  {result.source && (
                    <span className="truncate">{result.source}</span>
                  )}
                  {(() => {
                    const dateStr = result.publishedDate || result.date;
                    if (!dateStr) return null;
                    
                    try {
                      const date = new Date(dateStr);
                      if (isNaN(date.getTime())) return null;
                      
                      return (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {date.toLocaleDateString()}
                        </span>
                      );
                    } catch {
                      return null;
                    }
                  })()}
                  <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  )
}