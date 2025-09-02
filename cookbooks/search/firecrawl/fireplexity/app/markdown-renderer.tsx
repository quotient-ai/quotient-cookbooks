'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CitationTooltip } from './citation-tooltip-portal'
import { SearchResult } from './types'

interface MarkdownRendererProps {
  content: string
  sources?: SearchResult[]
}

export function MarkdownRenderer({ content, sources }: MarkdownRendererProps) {
  // First, normalize all citation formats to [1] style
  const normalizedContent = content
    // Replace CITATION_1 with [1]
    .replace(/\bCITATION_(\d+)\b/g, '[$1]')
    // Replace ___CITATION_1___ with [1] (in case it's already processed)
    .replace(/___CITATION_(\d+)___/g, '[$1]')

  // Process content to replace [1] with React elements
  const processText = (text: string): React.ReactNode[] => {
    const parts = text.split(/(\[\d+\])/g)
    return parts.map((part, index) => {
      const match = part.match(/\[(\d+)\]/)
      if (match) {
        return (
          <sup
            key={index}
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

  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children, ...props }) => {
            const processedChildren = React.Children.map(children, (child) => {
              if (typeof child === 'string') {
                return processText(child)
              }
              return child
            })
            return <p className="mb-4 last:mb-0" {...props}>{processedChildren}</p>
          },
          li: ({ children, ...props }) => {
            const processedChildren = React.Children.map(children, (child) => {
              if (typeof child === 'string') {
                return processText(child)
              }
              // Handle nested elements recursively
              if (React.isValidElement(child)) {
                const childElement = child as React.ReactElement<any>
                if (childElement.props.children) {
                  return React.cloneElement(childElement, {
                    children: React.Children.map(childElement.props.children, (nestedChild) => {
                      if (typeof nestedChild === 'string') {
                        return processText(nestedChild)
                      }
                      return nestedChild
                    })
                  })
                }
              }
              return child
            })
            return <li {...props}>{processedChildren}</li>
          },
          strong: ({ children, ...props }) => {
            const processedChildren = React.Children.map(children, (child) => {
              if (typeof child === 'string') {
                return processText(child)
              }
              return child
            })
            return <strong {...props}>{processedChildren}</strong>
          },
          em: ({ children, ...props }) => {
            const processedChildren = React.Children.map(children, (child) => {
              if (typeof child === 'string') {
                return processText(child)
              }
              return child
            })
            return <em {...props}>{processedChildren}</em>
          },
          ul: ({ children }) => <ul className="mb-4 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 last:mb-0">{children}</ol>,
          h1: ({ children }) => <h1 className="text-xl font-semibold mb-3 mt-6 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-semibold mb-3 mt-6 first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-semibold mb-2 mt-4 first:mt-0">{children}</h3>,
          code: ({ children, ...props }) => {
            const inline = !('className' in props && props.className?.includes('language-'))
            return inline ? (
              <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-sm">{children}</code>
            ) : (
              <code>{children}</code>
            )
          },
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
      {sources && sources.length > 0 && <CitationTooltip sources={sources} />}
    </>
  )
}