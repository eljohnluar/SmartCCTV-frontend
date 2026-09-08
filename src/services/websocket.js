/**
 * WebSocket client for real-time backend events (system status, AI engine feed).
 * Supabase Realtime handles live DB updates separately.
 */

const WS_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8000/ws'

class WSClient {
  constructor() {
    this.ws = null
    this.listeners = new Map()
    this.reconnectDelay = 3000
    this.reconnectTimer = null
    this.shouldReconnect = false
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return

    this.shouldReconnect = true

    try {
      this.ws = new WebSocket(WS_URL)

      this.ws.onopen = () => {
        console.log('[WS] Connected to backend')
        this._emit('open', null)
        clearTimeout(this.reconnectTimer)
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this._emit(data.type || 'message', data)
          this._emit('*', data)
        } catch {
          this._emit('raw', event.data)
        }
      }

      this.ws.onerror = (err) => {
        console.warn('[WS] Error:', err)
        this._emit('error', err)
      }

      this.ws.onclose = () => {
        console.log('[WS] Disconnected')
        this._emit('close', null)
        if (this.shouldReconnect) {
          this.reconnectTimer = setTimeout(() => this.connect(), this.reconnectDelay)
        }
      }
    } catch (err) {
      console.warn('[WS] Could not connect to backend WebSocket:', err.message)
    }
  }

  disconnect() {
    this.shouldReconnect = false
    clearTimeout(this.reconnectTimer)
    this.ws?.close()
    this.ws = null
  }

  on(event, callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event).add(callback)
    return () => this.listeners.get(event)?.delete(callback)
  }

  _emit(event, data) {
    this.listeners.get(event)?.forEach((cb) => cb(data))
  }

  send(data) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

export const wsClient = new WSClient()
export default wsClient
