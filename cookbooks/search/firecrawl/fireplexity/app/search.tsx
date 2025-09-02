'use client'

import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchComponentProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void
  isLoading: boolean
}

export function SearchComponent({ handleSubmit, input, handleInputChange, isLoading }: SearchComponentProps) {
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto pt-12">
      <div className="relative flex items-center">
        <Input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything..."
          className="pr-24 h-14 text-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input || input.trim() === ''}
          className="absolute right-2 p-0 flex items-center justify-center rounded-lg bg-[#ff4d00] hover:bg-[#e64400] disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95 group"
        >
          <div className="w-[60px] h-[38px] flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <svg 
                fill="none" 
                height="20" 
                viewBox="0 0 20 20" 
                width="20" 
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
    </form>
  )
}