'use client'

import dynamic from 'next/dynamic'

// Dynamically import TradingView widget to avoid SSR issues
const TradingViewWidget = dynamic(
  () => import('@/components/trading-view-widget'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading chart...</p>
      </div>
    )
  }
)

interface StockChartProps {
  ticker: string
  theme?: 'light' | 'dark'
}

// Validate ticker format (EXCHANGE:SYMBOL)
function isValidTicker(ticker: string): boolean {
  const tickerPattern = /^(NYSE|NASDAQ|AMEX|XETR|HKEX|LSE|TSE|ASX|NSE|BSE):[A-Z0-9.]{1,5}$/
  return tickerPattern.test(ticker)
}

export function StockChart({ ticker, theme = 'light' }: StockChartProps) {
  // Validate ticker format
  if (!isValidTicker(ticker)) {
    console.warn(`Invalid ticker format: ${ticker}`)
    // Still render the widget even if validation fails - let TradingView handle it
  }

  return (
    <div className="mb-6 w-full">
      <TradingViewWidget symbol={ticker} theme={theme} />
    </div>
  )
}