'use client'

import { ExternalLink, FileText, Calendar, User, Globe } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { SearchResult } from './types'
import Image from 'next/image'
import { CharacterCounter } from './character-counter'

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse bg-white dark:bg-zinc-800 border-gray-200 dark:border-gray-700">
            <div className="h-32 bg-gray-200 dark:bg-zinc-700 rounded-lg mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-5/6"></div>
          </Card>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <Card className="p-8 text-center bg-gray-50 dark:bg-zinc-700 border-gray-200 dark:border-gray-600">
        <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No results found. Try a different search query.</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((result, index) => (
        <a
          key={index}
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block opacity-0 animate-fade-up"
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'forwards'
          }}
        >
          <Card className="h-full p-4 bg-white dark:bg-zinc-800 border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            {/* Image/Thumbnail */}
            {result.image && (
              <div className="relative h-32 mb-3 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-700">
                <Image
                  src={result.image}
                  alt={result.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
            )}
            
            {/* Site info */}
            <div className="flex items-center gap-2 mb-2">
              {result.favicon && (
                <Image
                  src={result.favicon}
                  alt=""
                  width={16}
                  height={16}
                  className="rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {result.siteName || new URL(result.url).hostname}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400">
              {result.title}
            </h3>

            {/* Character count */}
            <div className="mb-2">
              <CharacterCounter 
                targetCount={result.markdown?.length || result.content?.length || 0} 
                duration={2000}
              />
            </div>

            {/* Description */}
            {result.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                {result.description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              {result.publishedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(result.publishedDate).toLocaleDateString()}
                </span>
              )}
              {result.author && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {result.author}
                </span>
              )}
              <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Card>
        </a>
      ))}
    </div>
  )
}