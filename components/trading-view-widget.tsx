'use client'

import React, { useEffect, useRef, memo } from 'react'

interface TradingViewWidgetProps {
  symbol: string
  theme?: 'light' | 'dark'
}

function TradingViewWidget({ symbol, theme = 'light' }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear any existing content
    containerRef.current.innerHTML = `
      <div class="tradingview-widget-container__widget" style="height: 100%; width: 100%;"></div>
      <div class="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span class="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    `

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: false,
      symbol: symbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: theme,
      style: '2',
      locale: 'en',
      allow_symbol_change: true,
      save_image: false,
      support_host: 'https://www.tradingview.com',
      width: '100%',
      height: 300
    })

    containerRef.current.appendChild(script)

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [symbol, theme])

  return (
    <div 
      className="tradingview-widget-container opacity-0 animate-fade-up [animation-duration:500ms] [animation-delay:400ms] [animation-fill-mode:forwards] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700" 
      ref={containerRef} 
      style={{ height: '300px', width: '100%' }}
    />
  )
}

export default memo(TradingViewWidget)