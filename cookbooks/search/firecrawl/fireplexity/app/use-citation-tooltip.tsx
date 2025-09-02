'use client'

import { useState, useEffect, useRef } from 'react'
import { SearchResult } from './types'

export function useCitationTooltip(sources: SearchResult[]) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [content, setContent] = useState<{ title: string; url: string; favicon?: string; index: number } | null>(null)
  const [isBelow, setIsBelow] = useState(false)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentTargetRef = useRef<HTMLElement | null>(null)

  const showTooltip = (target: HTMLElement, source: SearchResult, index: number) => {
    // Clear any pending timeouts
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current)
      showTimeoutRef.current = null
    }

    currentTargetRef.current = target
    const rect = target.getBoundingClientRect()
    
    // Calculate position to ensure tooltip is always visible
    const tooltipWidth = 320 // max-w-xs is roughly 320px
    const tooltipHeight = 100 // Increased height for better estimation
    const padding = 10
    
    // Use viewport coordinates with scroll offset for fixed positioning
    let top = rect.top - tooltipHeight - 5  // Small gap between citation and tooltip
    let left = rect.left + rect.width / 2
    
    // Ensure tooltip doesn't go off-screen
    let showBelow = false
    if (top < padding) {
      // Show below if not enough space above
      top = rect.bottom + 5  // Reduced gap
      showBelow = true
    }
    setIsBelow(showBelow)
    
    // Adjust horizontal position if needed
    const viewportWidth = window.innerWidth
    if (left - tooltipWidth / 2 < padding) {
      left = tooltipWidth / 2 + padding
    } else if (left + tooltipWidth / 2 > viewportWidth - padding) {
      left = viewportWidth - tooltipWidth / 2 - padding
    }
    
    setPosition({ top, left })
    
    setContent({
      title: source.title,
      url: source.url,
      favicon: source.favicon,
      index: index + 1
    })
    
    // Small delay to ensure smooth transitions
    showTimeoutRef.current = setTimeout(() => {
      setVisible(true)
    }, 10)
  }

  const hideTooltip = (immediate = false) => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current)
      showTimeoutRef.current = null
    }
    
    const hide = () => {
      setVisible(false)
      currentTargetRef.current = null
    }
    
    if (immediate) {
      hide()
    } else {
      hideTimeoutRef.current = setTimeout(hide, 300)  // Increased delay for better UX
    }
  }

  const handleMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    
    if (target.tagName === 'SUP' && target.classList.contains('citation')) {
      // Extract citation number
      const citationAttr = target.getAttribute('data-citation')
      let citationNumber: number
      
      if (citationAttr) {
        citationNumber = parseInt(citationAttr, 10)
      } else {
        const match = target.textContent?.match(/\[(\d+)\]/)
        citationNumber = match ? parseInt(match[1], 10) : 0
      }
      
      const source = sources[citationNumber - 1]
      
      if (source) {
        // If hovering over the same citation, just cancel hide
        if (currentTargetRef.current === target) {
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
            hideTimeoutRef.current = null
          }
        } else {
          // Different citation - show new tooltip
          showTooltip(target, source, citationNumber - 1)
        }
      }
    }
  }

  const handleMouseOut = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const relatedTarget = e.relatedTarget as HTMLElement
    
    // Don't hide if moving within the same citation
    if (currentTargetRef.current?.contains(relatedTarget)) {
      return
    }
    
    if (target.tagName === 'SUP' && target.classList.contains('citation')) {
      hideTooltip()
    }
  }

  useEffect(() => {
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    
    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)
    }
  }, [sources])

  const cancelHide = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }

  return {
    visible,
    position,
    content,
    isBelow,
    hideTooltip,
    cancelHide
  }
}