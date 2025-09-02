'use client'

import { useEffect, useState } from 'react'

interface CharacterCounterProps {
  targetCount: number
  duration?: number // Duration in milliseconds
}

export function CharacterCounter({ targetCount, duration = 2000 }: CharacterCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (targetCount === 0) return

    const startTime = Date.now()
    const startCount = 0
    const endCount = targetCount

    const updateCount = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Use easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(startCount + (endCount - startCount) * easeOutQuart)

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      } else {
        setCount(endCount)
      }
    }

    requestAnimationFrame(updateCount)
  }, [targetCount, duration])

  return (
    <span className="font-mono text-[10px] text-gray-500 dark:text-gray-400">
      {count.toLocaleString()} chars
    </span>
  )
}