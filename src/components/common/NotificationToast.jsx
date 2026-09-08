import { Toaster } from 'react-hot-toast'

export default function NotificationToast() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1a1d27',
          color: '#f1f5f9',
          border: '1px solid #2d3148',
          borderRadius: '10px',
          fontSize: '13px',
          padding: '12px 16px',
        },
        success: {
          iconTheme: { primary: '#22c55e', secondary: '#0f1117' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#0f1117' },
        },
      }}
    />
  )
}
