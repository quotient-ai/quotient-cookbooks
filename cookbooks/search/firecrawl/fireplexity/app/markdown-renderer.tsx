'use client'

import React, { useMemo, useCallback } from 'react'
import Streamdown from 'streamdown'
import { CitationTooltip } from './citation-tooltip-portal'
import { SearchResult } from './types'

interface MarkdownRendererProps {
  content: string
  sources?: SearchResult[]
}

export function MarkdownRenderer({ content, sources }: MarkdownRendererProps) {
  // Process content to convert citations to clickable elements
  const processedContent = useMemo(() => {
    return content
      // Replace CITATION_1 with [1]
      .replace(/\bCITATION_(\d+)\b/g, '___CITATION_$1___')
      // Replace ___CITATION_1___ with [1] if not already done
      .replace(/___CITATION_(\d+)___/g, '[$1]')
  }, [content])

  // Process children to convert [1] to citation elements  
  const processChildren = useCallback((children: any): any => {
    if (typeof children === 'string') {
      const parts = children.split(/(\[\d+\])/g)
      return parts.map((part, index) => {
        const match = part.match(/\[(\d+)\]/)
        if (match) {
          return (
            <sup
              key={`citation-${match[1]}-${index}`}
              className="citation text-orange-600 cursor-pointer hover:text-orange-700 text-[0.65rem] ml-0.5"
              data-citation={match[1]}
            >
              [{match[1]}]
            </sup>
          )
        }
        return part
      })
    }
    
    if (Array.isArray(children)) {
      return children.map((child, i) => {
        if (typeof child === 'string') {
          return processChildren(child)
        }
        return child
      })
    }
    
    return children
  }, [])

  // Custom components for markdown rendering
  const components = useMemo(() => ({
    p: ({ children, ...props }: any) => (
      <p className="mb-4 last:mb-0" {...props}>
        {processChildren(children)}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="mb-4 last:mb-0">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="mb-4 last:mb-0">{children}</ol>
    ),
    li: ({ children, ...props }: any) => (
      <li {...props}>{processChildren(children)}</li>
    ),
    h1: ({ children }: any) => (
      <h1 className="text-xl font-semibold mb-3 mt-6 first:mt-0">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-lg font-semibold mb-3 mt-6 first:mt-0">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-base font-semibold mb-2 mt-4 first:mt-0">{children}</h3>
    ),
    code: ({ children, className }: any) => {
      const inline = !className?.includes('language-')
      return inline ? (
        <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-sm">{children}</code>
      ) : (
        <code className={className}>{children}</code>
      )
    },
    strong: ({ children, ...props }: any) => (
      <strong {...props}>{processChildren(children)}</strong>
    ),
    em: ({ children, ...props }: any) => (
      <em {...props}>{processChildren(children)}</em>
    ),
  }), [processChildren])

  return (
    <>
      <Streamdown
        parseIncompleteMarkdown={true}
        components={components}
      >
        {processedContent}
      </Streamdown>
      {sources && sources.length > 0 && <CitationTooltip sources={sources} />}
    </>
  )
}