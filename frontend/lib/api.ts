// Central API configuration
// In production, NEXT_PUBLIC_API_URL should be set to your Koyeb backend URL
// e.g. https://keyllect-api-xxxxx.koyeb.app
const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000'

export function apiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`
}

export function mediaUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${API_BASE}${cleanUrl}`
}
