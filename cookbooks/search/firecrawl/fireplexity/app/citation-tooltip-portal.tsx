'use client'

import { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { SearchResult } from './types'
import { FaviconImage } from './favicon-image'
import { useCitationTooltip } from './use-citation-tooltip'

interface CitationTooltipProps {
  sources: SearchResult[]
}

export function CitationTooltip({ sources }: CitationTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const { visible, position, content, isBelow, hideTooltip, cancelHide } = useCitationTooltip(sources)
  const portalRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Create or find portal container
    let container = document.getElementById('citation-tooltip-portal')
    if (!container) {
      container = document.createElement('div')
      container.id = 'citation-tooltip-portal'
      container.style.position = 'fixed'
      container.style.top = '0'
      container.style.left = '0'
      container.style.width = '100%'
      container.style.height = '0'
      container.style.pointerEvents = 'none'
      container.style.zIndex = '2147483647' // Maximum z-index value
      container.style.isolation = 'isolate' // Create new stacking context
      document.body.appendChild(container)
    }
    portalRef.current = container

    return () => {
      // Don't remove the container as other tooltips might be using it
    }
  }, [])

  if (!visible || !content || !portalRef.current) {
    return null
  }

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className={`fixed transition-all duration-150 ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
        pointerEvents: 'auto',
      }}
      onMouseEnter={() => {
        // Cancel hide when hovering tooltip
        cancelHide()
      }}
      onMouseLeave={() => {
        // Hide when leaving tooltip
        hideTooltip()
      }}
    >
      <div 
        className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl p-3 max-w-xs cursor-pointer hover:border-orange-400 dark:hover:border-orange-500 transition-colors relative"
        onClick={() => {
          if (content?.url) {
            window.open(content.url, '_blank', 'noopener,noreferrer')
          }
        }}
      >
        {/* Arrow */}
        {isBelow ? (
          <>
            {/* Arrow pointing up when tooltip is below */}
            <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white dark:border-b-zinc-800" />
            <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px] border-b-gray-200 dark:border-b-gray-700" />
          </>
        ) : (
          <>
            {/* Arrow pointing down when tooltip is above */}
            <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white dark:border-t-zinc-800" />
            <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-gray-200 dark:border-t-gray-700" />
          </>
        )}
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 mt-0.5">
            <FaviconImage
              src={content.favicon}
              size={16}
              className="w-4 h-4 object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
              {content.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
              {content.url.length > 50 ? content.url.substring(0, 50) + '...' : content.url}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(tooltipContent, portalRef.current)
}