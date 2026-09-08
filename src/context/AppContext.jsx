import { createContext, useCallback, useContext, useEffect, useReducer } from 'react'
import { getSystemStatus, setAttendanceRecording as setAttendanceRecordingApi } from '../services/api'
import { wsClient } from '../services/websocket'
import { SYSTEM_STATUS } from '../utils/constants'

const AppContext = createContext(null)

const initialState = {
  sidebarOpen: true,
  systemStatus: SYSTEM_STATUS.OFFLINE,
  cameraActive: false,
  aiActive: false,
  attendanceRecording: true,
  notifications: [],
  unreadCount: 0,
}

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    case 'SET_SYSTEM_STATUS':
      return {
        ...state,
        systemStatus: action.payload.status,
        cameraActive: action.payload.camera_active ?? false,
        aiActive: action.payload.ai_active ?? false,
        attendanceRecording: action.payload.attendance_recording ?? state.attendanceRecording,
      }
    case 'SET_ATTENDANCE_RECORDING':
      return { ...state, attendanceRecording: action.payload }
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 50),
        unreadCount: state.unreadCount + 1,
      }
    case 'MARK_READ':
      return { ...state, unreadCount: 0 }
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [], unreadCount: 0 }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Poll system status from backend
  const refreshStatus = useCallback(async () => {
    try {
      const data = await getSystemStatus()
      dispatch({ type: 'SET_SYSTEM_STATUS', payload: data })
    } catch {
      dispatch({
        type: 'SET_SYSTEM_STATUS',
        payload: { status: SYSTEM_STATUS.OFFLINE, camera_active: false, ai_active: false },
      })
    }
  }, [])

  useEffect(() => {
    refreshStatus()
    const interval = setInterval(refreshStatus, 15000)
    return () => clearInterval(interval)
  }, [refreshStatus])

  // WebSocket real-time events
  useEffect(() => {
    wsClient.connect()

    const unsubAlert = wsClient.on('alert', (data) => {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'alert',
          message: data.description || 'Security alert detected',
          timestamp: new Date().toISOString(),
        },
      })
    })

    const unsubAttendance = wsClient.on('attendance', (data) => {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'attendance',
          message: `${data.student_name} marked ${data.status}`,
          timestamp: new Date().toISOString(),
        },
      })
    })

    return () => {
      unsubAlert()
      unsubAttendance()
      wsClient.disconnect()
    }
  }, [])

  const toggleSidebar = () => dispatch({ type: 'TOGGLE_SIDEBAR' })
  const addNotification = (n) => dispatch({ type: 'ADD_NOTIFICATION', payload: n })
  const markRead = () => dispatch({ type: 'MARK_READ' })
  const clearNotifications = () => dispatch({ type: 'CLEAR_NOTIFICATIONS' })
  const updateAttendanceRecording = useCallback(async (enabled) => {
    const data = await setAttendanceRecordingApi(enabled)
    dispatch({ type: 'SET_ATTENDANCE_RECORDING', payload: data.attendance_recording })
    return data
  }, [])

  return (
    <AppContext.Provider value={{
      ...state,
      toggleSidebar,
      addNotification,
      markRead,
      clearNotifications,
      refreshStatus,
      updateAttendanceRecording,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export default AppContext
