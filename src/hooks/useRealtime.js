import { useCallback, useEffect, useRef } from 'react'
import supabase from '../services/supabase'

/**
 * Subscribe to Supabase Realtime events on a given table.
 * Calls `onInsert`, `onUpdate`, `onDelete` with the row payload.
 */
export function useRealtime({ table, onInsert, onUpdate, onDelete, enabled = true }) {
  const channelRef = useRef(null)

  const subscribe = useCallback(() => {
    if (!enabled) return

    const channel = supabase
      .channel(`realtime:${table}:${Date.now()}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table }, (payload) => {
        onInsert?.(payload.new)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table }, (payload) => {
        onUpdate?.(payload.new, payload.old)
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table }, (payload) => {
        onDelete?.(payload.old)
      })
      .subscribe()

    channelRef.current = channel
  }, [table, enabled, onInsert, onUpdate, onDelete])

  useEffect(() => {
    subscribe()
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [subscribe])
}

export default useRealtime
