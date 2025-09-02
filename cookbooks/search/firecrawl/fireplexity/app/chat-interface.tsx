'use client'

import { useRef, useEffect } from 'react'
import { Send, Loader2, User, Sparkles, FileText, Plus, Copy, RefreshCw, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SearchResult, NewsResult, ImageResult } from './types'
import { type UIMessage } from 'ai'
import { CharacterCounter } from './character-counter'
import Image from 'next/image'
import { MarkdownRenderer } from './markdown-renderer'
import { StockChart } from './stock-chart'
import { NewsResults } from './news-results'
import { ImageResults } from './image-results'

interface MessageData {
  sources: SearchResult[]
  newsResults?: NewsResult[]
  imageResults?: ImageResult[]
  followUpQuestions: string[]
  ticker?: string
}

// Helper function to extract text content from UIMessage
function getMessageContent(message: UIMessage): string {
  if (!message.parts) return ''
  return message.parts
    .filter((part: any) => part.type === 'text')
    .map((part: any) => part.text)
    .join('')
}

interface ChatInterfaceProps {
  messages: UIMessage[]
  sources: SearchResult[]
  newsResults: NewsResult[]
  imageResults: ImageResult[]
  followUpQuestions: string[]
  searchStatus: string
  isLoading: boolean
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  messageData?: Map<number, MessageData>
  currentTicker?: string | null
}

export function ChatInterface({ messages, sources, newsResults, imageResults, followUpQuestions, searchStatus, isLoading, input, handleInputChange, handleSubmit, messageData, currentTicker }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  
  // Simple theme detection based on document class
  const theme = typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  
  // Extract the current query and check if we're waiting for response
  let query = ''
  let isWaitingForResponse = false
  
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1]
    const secondLastMessage = messages[messages.length - 2]
    
    if (lastMessage.role === 'user') {
      // Waiting for response to this user message
      query = getMessageContent(lastMessage)
      isWaitingForResponse = true
    } else if (secondLastMessage?.role === 'user' && lastMessage.role === 'assistant') {
      // Current conversation pair
      query = getMessageContent(secondLastMessage)
      isWaitingForResponse = false
    }
  }

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to bottom when new content appears
  useEffect(() => {
    if (!scrollContainerRef.current) return
    
    const container = scrollContainerRef.current
    
    // Always scroll to bottom when new messages arrive
    setTimeout(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      })
    }, 100)
  }, [messages, sources, followUpQuestions])

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    handleSubmit(e)
    
    // Scroll to bottom after submitting
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth'
        })
      }
    }, 100)
  }

  const handleFollowUpClick = (question: string) => {
    // Set the input and immediately submit
    handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLTextAreaElement>)
    // Submit the form after a brief delay to ensure input is set
    setTimeout(() => {
      formRef.current?.requestSubmit()
    }, 50)
  }

  const handleCopy = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content)
    setCopiedMessageId(messageId)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  const handleRewrite = () => {
    // Get the last user message and resubmit it
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
    if (lastUserMessage) {
      handleInputChange({ target: { value: getMessageContent(lastUserMessage) } } as React.ChangeEvent<HTMLTextAreaElement>)
      // Submit the form
      setTimeout(() => {
        formRef.current?.requestSubmit()
      }, 100)
    }
  }


  return (
    <div className="flex h-full relative" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Main content area */}
      <div className="flex-1 flex flex-col relative">
        {/* Top gradient overlay - removed */}
        
        {/* Scrollable content */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto pb-36 sm:pb-32 pt-8 scroll-smooth relative scrollbar-hide" 
          style={{ 
            scrollBehavior: 'smooth', 
            overscrollBehavior: 'contain', 
            WebkitOverflowScrolling: 'touch',
            isolation: 'isolate'
          } as React.CSSProperties}
        >
          <div className="max-w-4xl mx-auto space-y-6 pb-8">
          {/* Previous conversations */}
          {messages.length > 2 && (
            <>
              {/* Group messages in pairs (user + assistant) */}
              {(() => {
                const pairs: Array<{user: UIMessage, assistant?: UIMessage}> = []
                for (let i = 0; i < messages.length - 2; i += 2) {
                  pairs.push({
                    user: messages[i],
                    assistant: messages[i + 1]
                  })
                }
                return pairs
              })().map((pair, pairIndex) => {
                const assistantIndex = pairIndex
                const storedData = messageData?.get(assistantIndex)
                const messageSources = storedData?.sources || []
                const messageFollowUpQuestions = storedData?.followUpQuestions || []
                const messageTicker = storedData?.ticker || null
                
                return (
                  <div key={pairIndex} className="space-y-6">
                    {/* User message */}
                    {pair.user && (
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{getMessageContent(pair.user)}</h2>
                      </div>
                    )}
                    {pair.assistant && (
                      <>
                        {/* Sources - Show for each assistant response */}
                        {messageSources.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-black dark:text-white" />
                                <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sources</h2>
                              </div>
                              {messageSources.length > 5 && (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">+{messageSources.length - 5} more</span>
                                  <div className="flex -space-x-2">
                                    {messageSources.slice(5, 10).map((result, idx) => (
                                      <div key={idx} className="w-5 h-5 bg-white dark:bg-zinc-700 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
                                        {result.favicon ? (
                                          <Image
                                            src={result.favicon}
                                            alt=""
                                            width={16}
                                            height={16}
                                            className="w-4 h-4 object-contain"
                                            onError={(e) => {
                                              const target = e.target as HTMLImageElement
                                              target.style.display = 'none'
                                            }}
                                          />
                                        ) : (
                                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                          </svg>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                              {messageSources.slice(0, 5).map((result, idx) => (
                                <a
                                  key={idx}
                                  href={result.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md h-28"
                                >
                                  {/* Background image */}
                                  {result.image && (
                                    <div className="absolute inset-0">
                                      <Image
                                        src={result.image}
                                        alt=""
                                        fill
                                        sizes="(max-width: 640px) 20vw, (max-width: 1024px) 16vw, 12vw"
                                        className="object-cover"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement
                                          target.style.display = 'none'
                                        }}
                                      />
                                    </div>
                                  )}
                                  
                                  {/* Semi-transparent overlay for text visibility */}
                                  <div className="absolute inset-0 bg-white/90 dark:bg-zinc-800/90" />
                                  
                                  {/* Content */}
                                  <div className="relative p-3 flex flex-col justify-between h-full">
                                    {/* Favicon and domain */}
                                    <div className="flex items-center gap-1.5">
                                      <div className="flex-shrink-0 w-4 h-4 bg-white dark:bg-zinc-700 rounded flex items-center justify-center overflow-hidden">
                                        {result.favicon ? (
                                          <Image
                                            src={result.favicon}
                                            alt=""
                                            width={12}
                                            height={12}
                                            className="w-3 h-3 object-contain"
                                            onError={(e) => {
                                              const target = e.target as HTMLImageElement
                                              target.style.display = 'none'
                                            }}
                                          />
                                        ) : (
                                          <svg className="w-2.5 h-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                          </svg>
                                        )}
                                      </div>
                                      <p className="text-[10px] text-gray-600 dark:text-gray-300 truncate flex-1 font-medium">
                                        {result.siteName || new URL(result.url).hostname.replace('www.', '')}
                                      </p>
                                    </div>
                                    
                                    {/* Title */}
                                    <h3 className="font-medium text-xs text-gray-900 dark:text-white line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 leading-tight">
                                      {result.title}
                                    </h3>
                                    
                                    {/* Character count */}
                                    <div className="mt-1">
                                      <CharacterCounter 
                                        targetCount={result.markdown?.length || result.content?.length || 0} 
                                        duration={2000}
                                      />
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        
                        {/* Stock Chart - Show if ticker is available */}
                        {messageTicker && (
                          <div className="mb-6">
                            <StockChart ticker={messageTicker} theme={theme} />
                          </div>
                        )}
                        
                        {/* Answer */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-black dark:text-white" />
                              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Answer</h2>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleCopy(pair.assistant ? getMessageContent(pair.assistant) : '', `message-${pairIndex}`)}
                                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                title={copiedMessageId === `message-${pairIndex}` ? "Copied!" : "Copy response"}
                              >
                                {copiedMessageId === `message-${pairIndex}` ? (
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="prose prose-gray max-w-none dark:prose-invert prose-sm sm:prose-base break-words overflow-hidden">
                            <MarkdownRenderer 
                              content={pair.assistant ? getMessageContent(pair.assistant) : ''}
                              sources={messageSources}
                            />
                          </div>
                        </div>
                        
                        {/* Related Questions - Show after each assistant response */}
                        {messageFollowUpQuestions.length > 0 && (
                          <div className="mt-6">
                            <div className="flex items-center gap-2 mb-3">
                              <Sparkles className="h-4 w-4 text-black dark:text-white" />
                              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Related</h2>
                            </div>
                            <div className="space-y-2">
                              {messageFollowUpQuestions.map((question, qIndex) => (
                                <button
                                  key={qIndex}
                                  onClick={() => handleFollowUpClick(question)}
                                  className="w-full text-left p-2 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md group"
                                >
                                  <div className="flex items-start gap-2">
                                    <Plus className="h-4 w-4 text-gray-400 group-hover:text-orange-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 break-words">
                                      {question}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </>
          )}

          {/* Current conversation - always at the bottom */}
          {/* Current Query display */}
          {query && (messages.length <= 2 || messages[messages.length - 1]?.role === 'user' || messages[messages.length - 1]?.role === 'assistant') && (
            <div className="opacity-0 animate-fade-up [animation-duration:500ms] [animation-fill-mode:forwards]">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">{query}</h1>
            </div>
          )}

          {/* Status message */}
          {searchStatus && (
            <div className="opacity-0 animate-fade-up [animation-duration:300ms] [animation-fill-mode:forwards] mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{searchStatus}</span>
              </div>
            </div>
          )}

          {/* Sources, Images & News - Animated in first */}
          {(sources.length > 0 || imageResults.length > 0 || newsResults.length > 0) && !isWaitingForResponse && (
            <div className="opacity-0 animate-fade-up [animation-duration:500ms] [animation-delay:200ms] [animation-fill-mode:forwards] space-y-4">
              {/* Sources Section */}
              {sources.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-black dark:text-white" />
                      <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sources</h2>
                    </div>
                {sources.length > 5 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">+{sources.length - 5} more</span>
                    <div className="flex -space-x-2">
                      {sources.slice(5, 10).map((result, index) => (
                        <div key={index} className="w-5 h-5 bg-white dark:bg-zinc-700 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
                          {result.favicon ? (
                            <Image
                              src={result.favicon}
                              alt=""
                              width={16}
                              height={16}
                              className="w-4 h-4 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                            />
                          ) : (
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {sources.slice(0, 5).map((result, index) => (
                  <a
                    key={index}
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md h-28"
                  >
                    {/* Background image */}
                    {result.image && (
                      <div className="absolute inset-0">
                        <Image
                          src={result.image}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 20vw, (max-width: 1024px) 16vw, 12vw"
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Semi-transparent overlay for text visibility */}
                    <div className="absolute inset-0 bg-white/90 dark:bg-zinc-800/90" />
                    
                    {/* Content */}
                    <div className="relative p-3 flex flex-col justify-between h-full">
                      {/* Favicon and domain */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex-shrink-0 w-4 h-4 bg-white dark:bg-zinc-700 rounded flex items-center justify-center overflow-hidden">
                          {result.favicon ? (
                            <Image
                              src={result.favicon}
                              alt=""
                              width={12}
                              height={12}
                              className="w-3 h-3 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                            />
                          ) : (
                            <svg className="w-2.5 h-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-600 dark:text-gray-300 truncate flex-1 font-medium">
                          {result.siteName || new URL(result.url).hostname.replace('www.', '')}
                        </p>
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-medium text-xs text-gray-900 dark:text-white line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 leading-tight">
                        {result.title}
                      </h3>
                      
                      {/* Character count */}
                      <div className="mt-1">
                        <CharacterCounter 
                          targetCount={result.markdown?.length || result.content?.length || 0} 
                          duration={2000}
                        />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
                </div>
              )}
              
              {/* Images Section - Grouped with Sources */}
              {imageResults.length > 0 && (
                <div className="lg:hidden">
                  <ImageResults results={imageResults} isLoading={false} />
                </div>
              )}
              
              {/* News Section - Grouped with Sources and Images */}
              {newsResults.length > 0 && (
                <div className="lg:hidden">
                  <NewsResults results={newsResults} isLoading={false} />
                </div>
              )}
            </div>
          )}


          {/* Stock Chart - Show if ticker is available */}
          {currentTicker && messages.length > 0 && messages[messages.length - 2]?.role === 'user' && (
            <div className="opacity-0 animate-fade-up [animation-duration:500ms] [animation-delay:200ms] [animation-fill-mode:forwards] mb-6">
              <StockChart ticker={currentTicker} theme={theme} />
            </div>
          )}

          {/* AI Answer - Streamed in */}
          {messages.length > 0 && messages[messages.length - 2]?.role === 'user' && messages[messages.length - 1]?.role === 'assistant' && (
            <div className="opacity-0 animate-fade-up [animation-duration:500ms] [animation-fill-mode:forwards]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-black dark:text-white" />
                  <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Answer</h2>
                </div>
                {!isLoading && (
                  <div className="flex items-center gap-1 opacity-0 animate-fade-in [animation-duration:300ms] [animation-delay:200ms] [animation-fill-mode:forwards]">
                    <button
                      onClick={() => handleCopy(getMessageContent(messages[messages.length - 1]), 'current-message')}
                      className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                      title={copiedMessageId === 'current-message' ? "Copied!" : "Copy response"}
                    >
                      {copiedMessageId === 'current-message' ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={handleRewrite}
                      className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                      title="Rewrite response"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <div className="prose prose-gray max-w-none dark:prose-invert prose-sm sm:prose-base prose-p:leading-relaxed prose-pre:bg-gray-100 dark:prose-pre:bg-zinc-900 break-words overflow-hidden">
                  <MarkdownRenderer 
                    content={getMessageContent(messages[messages.length - 1])}
                    sources={sources}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Show loading state while streaming */}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="opacity-0 animate-fade-up [animation-duration:500ms] [animation-fill-mode:forwards]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-black dark:text-white" />
                <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Answer</h2>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating answer...</span>
                </div>
              </div>
            </div>
          )}

          {/* Follow-up Questions - Show after answer completes */}
          {followUpQuestions.length > 0 && !isWaitingForResponse && (
            <div className="opacity-0 animate-fade-up [animation-duration:300ms] [animation-fill-mode:forwards]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-black dark:text-white" />
                <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Related</h2>
              </div>
              <div className="space-y-2">
                {followUpQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleFollowUpClick(question)}
                    className="w-full text-left p-2 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md group"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-gray-400 group-hover:text-orange-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                        {question}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed input at bottom */}
      <div className="fixed lg:absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white dark:from-zinc-900 dark:via-zinc-900 to-transparent pt-4 pb-4 sm:pt-6 sm:pb-6 z-30">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-8">
          <form onSubmit={handleFormSubmit} ref={formRef}>
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 focus-within:border-gray-900 dark:focus-within:border-gray-100 transition-colors">
              <div className="flex items-end gap-2">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      formRef.current?.requestSubmit()
                    }
                  }}
                  placeholder="Ask a follow-up question..."
                  className="resize-none border-0 focus:ring-0 focus:outline-none bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 py-2 pr-2 shadow-none focus-visible:ring-0 focus-visible:border-0"
                  rows={1}
                  style={{
                    minHeight: '36px',
                    maxHeight: '100px',
                    scrollbarWidth: 'thin',
                    boxShadow: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-0 flex items-center justify-center rounded-lg bg-[#ff4d00] hover:bg-[#e64400] disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95 group"
                >
                  <div className="w-[48px] h-[32px] flex items-center justify-center">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <svg 
                        fill="none" 
                        height="18" 
                        viewBox="0 0 20 20" 
                        width="18" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white"
                      >
                        <path 
                          d="M11.6667 4.79163L16.875 9.99994M16.875 9.99994L11.6667 15.2083M16.875 9.99994H3.125" 
                          stroke="currentColor" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="1.5"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>
        
      </div>
    </div>
    
    {/* Right sidebar for news and images - Hidden on mobile, shown on large screens */}
      {(newsResults.length > 0 || imageResults.length > 0 || (isLoading && messages.length > 0)) && (
        <div className="hidden lg:block w-80 min-w-[320px] bg-transparent overflow-y-auto p-4 space-y-6 scrollbar-hide">
          {/* Image Results - Now at the top */}
          <ImageResults results={imageResults} isLoading={isLoading && imageResults.length === 0} />
          
          {/* News Results */}
          <NewsResults results={newsResults} isLoading={isLoading && newsResults.length === 0} />
        </div>
      )}
    </div>
  )
}