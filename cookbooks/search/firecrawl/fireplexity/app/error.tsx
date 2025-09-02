'use client'

import { GracefulError } from '@/components/graceful-error'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; statusCode?: number }
  reset: () => void
}) {
  return <GracefulError error={error} reset={reset} />
}