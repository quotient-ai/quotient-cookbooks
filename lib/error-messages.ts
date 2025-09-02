export const ErrorMessages = {
  401: {
    title: "Authentication Required",
    message: "Please check your API key is valid and properly configured.",
    action: "Get your API key",
    actionUrl: "https://www.firecrawl.dev/app/api-keys"
  },
  402: {
    title: "Credits Exhausted", 
    message: "You've run out of Firecrawl credits for this billing period.",
    action: "Upgrade your plan",
    actionUrl: "https://firecrawl.dev/pricing"
  },
  429: {
    title: "Rate Limit Reached",
    message: "Too many requests. Please wait a moment before trying again.",
    action: "Learn about rate limits",
    actionUrl: "https://docs.firecrawl.dev/rate-limits"
  },
  500: {
    title: "Something went wrong",
    message: "We encountered an unexpected error. Please try again.",
    action: "Contact support",
    actionUrl: "https://firecrawl.dev/support"
  },
  504: {
    title: "Request Timeout",
    message: "This request is taking longer than expected. Try with fewer pages or simpler content.",
    action: "Optimize your request",
    actionUrl: "https://docs.firecrawl.dev/best-practices"
  }
} as const

export function getErrorMessage(statusCode: number): typeof ErrorMessages[keyof typeof ErrorMessages] {
  return ErrorMessages[statusCode as keyof typeof ErrorMessages] || ErrorMessages[500]
}