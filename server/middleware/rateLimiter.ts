// server/middleware/rateLimiter.ts
import { defineEventHandler, createError, H3Event } from 'h3'

// Store client requests with timestamps
const requestMap = new Map<string, number>()

// Rate limit configuration
const RATE_LIMIT_WINDOW = 3000 // 3 seconds in milliseconds

export default defineEventHandler((event: H3Event) => {
  // Only apply rate limiting to specific routes
  if (!event.path?.startsWith('/api/raffle')) {
    return
  }

  // Get client IP address
  const clientIp = getClientIp(event)

  if (!clientIp) {
    throw createError({
      statusCode: 400,
      message: 'Cannot identify client'
    })
  }

  // Check if client has made a recent request
  const lastRequestTime = requestMap.get(clientIp)
  const currentTime = Date.now()

  if (lastRequestTime) {
    const timeElapsed = currentTime - lastRequestTime

    if (timeElapsed < RATE_LIMIT_WINDOW) {
      throw createError({
        statusCode: 429,
        message: `Too Many Requests. Please wait ${Math.ceil((RATE_LIMIT_WINDOW - timeElapsed) / 1000)} seconds.`
      })
    }
  }

  // Update last request time
  requestMap.set(clientIp, currentTime)

  // Clean up old entries periodically
  if (requestMap.size > 10000) { // Prevent memory leaks
    const cutoffTime = currentTime - RATE_LIMIT_WINDOW
    for (const [ip, timestamp] of requestMap.entries()) {
      if (timestamp < cutoffTime) {
        requestMap.delete(ip)
      }
    }
  }
})

// Helper function to get client IP
function getClientIp(event: H3Event): string | undefined {
  // Try to get IP from various headers
  return event.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    event.headers.get('x-real-ip') ||
    event.headers.get('cf-connecting-ip') ||
    event.node.req.socket.remoteAddress
}
