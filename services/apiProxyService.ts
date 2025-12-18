/**
 * API Proxy Service
 * 
 * Since Google Places API has CORS restrictions when called from browser,
 * this service provides a structure for using a backend proxy.
 * 
 * For now, it attempts direct calls but provides clear error messages.
 * In production, you should set up a backend proxy.
 */

const API_PROXY_URL = import.meta.env.VITE_API_PROXY_URL || process.env.API_PROXY_URL;

/**
 * Make a proxied API call through backend (if available)
 * Falls back to direct call if no proxy configured
 */
export async function proxiedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // If proxy URL is configured, use it
  if (API_PROXY_URL) {
    try {
      const response = await fetch(`${API_PROXY_URL}/proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          method: options.method || 'GET',
          headers: options.headers,
        }),
      });
      return response;
    } catch (error) {
      console.error('Proxy request failed:', error);
      throw new Error('Backend proxy is not available. Please set up a backend server or use API keys that support CORS.');
    }
  }

  // Otherwise, try direct call (may fail due to CORS)
  return fetch(url, options);
}

/**
 * Check if CORS error occurred
 */
export function isCorsError(error: any): boolean {
  return (
    error instanceof TypeError &&
    (error.message.includes('CORS') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError'))
  );
}

/**
 * Get helpful error message for API issues
 */
export function getApiErrorMessage(error: any, serviceName: string): string {
  if (isCorsError(error)) {
    return `${serviceName} cannot be accessed directly from the browser due to CORS restrictions. Please set up a backend proxy or use an API that supports CORS.`;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return `Failed to access ${serviceName}. Please check your API key and network connection.`;
}

