/**
 * In-memory rate limiter for API endpoints
 * Tracks requests per IP address with configurable limits
 */

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number; // Time window in milliseconds
}

interface RequestRecord {
    count: number;
    resetTime: number;
}

class RateLimiter {
    private store: Map<string, RequestRecord> = new Map();
    private config: RateLimitConfig;

    constructor(config: RateLimitConfig) {
        this.config = config;
    }

    /**
     * Check if a request should be allowed
     * @param key - Unique identifier (typically IP address)
     * @returns Object with allowed status and retry-after time
     */
    check(key: string): { allowed: boolean; retryAfter?: number } {
        const now = Date.now();
        const record = this.store.get(key);

        // No record or window expired - allow request
        if (!record || now >= record.resetTime) {
            this.store.set(key, {
                count: 1,
                resetTime: now + this.config.windowMs,
            });
            return { allowed: true };
        }

        // Increment counter
        record.count++;

        // Check if limit exceeded
        if (record.count > this.config.maxRequests) {
            const retryAfter = Math.ceil((record.resetTime - now) / 1000);
            return { allowed: false, retryAfter };
        }

        return { allowed: true };
    }

    /**
     * Reset rate limit for a specific key
     */
    reset(key: string): void {
        this.store.delete(key);
    }

    /**
     * Clear all rate limit records
     */
    clear(): void {
        this.store.clear();
    }
}

// Create rate limiters for sensitive endpoints
export const buildTxLimiter = new RateLimiter({
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
});

export const paycrestOrderLimiter = new RateLimiter({
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
});

/**
 * Extract client IP from request headers
 * Handles X-Forwarded-For, X-Real-IP, and direct connection
 */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    // Fallback to connection info if available
    return 'unknown';
}
