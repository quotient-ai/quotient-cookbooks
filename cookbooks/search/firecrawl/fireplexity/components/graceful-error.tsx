'use client'

import React from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface GracefulErrorProps {
  error: Error & { digest?: string; statusCode?: number }
  reset?: () => void
}

export function GracefulError({ error, reset }: GracefulErrorProps) {
  const statusCode = error.statusCode || 500
  
  const errorMessages: Record<number, { title: string; description: string }> = {
    401: {
      title: "Authentication Required",
      description: "It looks like there's an issue with your API key. Please check your configuration."
    },
    402: {
      title: "Out of Credits",
      description: "You've used up your Firecrawl credits. Time to upgrade your plan!"
    },
    429: {
      title: "Slow Down There!",
      description: "You're making requests too quickly. Take a breather and try again in a moment."
    },
    500: {
      title: "Oops! Something went wrong",
      description: "We encountered an unexpected error. Don't worry, it's not you, it's us."
    },
    504: {
      title: "Taking Too Long",
      description: "This request is taking longer than expected. Try again with less content."
    }
  }
  
  const { title, description } = errorMessages[statusCode] || errorMessages[500]
  
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {description}
          </p>
          
          {error.digest && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-6">
              Error ID: {error.digest}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {reset && (
              <Button
                onClick={reset}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
            )}
            
            <Link href="/">
              <Button variant="default" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}