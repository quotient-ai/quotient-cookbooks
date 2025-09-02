import React from 'react'
import { AlertCircle, RefreshCw, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/error-messages'

interface ErrorDisplayProps {
  error: Error | { statusCode?: number; message?: string }
  onRetry?: () => void
  context?: string
}

export function ErrorDisplay({ error, onRetry, context }: ErrorDisplayProps) {
  // Extract status code from error
  const statusCode = 'statusCode' in error && error.statusCode ? error.statusCode : 500
  const errorInfo = getErrorMessage(statusCode)
  
  // Extract retry time from rate limit errors
  const retryAfter = error.message?.match(/retry after (\d+)s/)?.[1]
  
  return (
    <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 dark:text-red-100">
            {errorInfo.title}
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
            {errorInfo.message}
          </p>
          
          {context && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              Context: {context}
            </p>
          )}
          
          {retryAfter && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              Please wait {retryAfter} seconds before retrying.
            </p>
          )}
          
          <div className="flex items-center gap-3 mt-4">
            {onRetry && statusCode !== 402 && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="text-red-700 border-red-300 hover:bg-red-100 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900/20"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Try again
              </Button>
            )}
            
            <a
              href={errorInfo.actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-red-700 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
            >
              {errorInfo.action}
              <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}