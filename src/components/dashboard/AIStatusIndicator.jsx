import { Camera, Cpu, Eye, Volume2, Wifi, WifiOff } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useApp } from '../../context/AppContext'
import { SYSTEM_STATUS } from '../../utils/constants'
import { testVoiceAnnouncement } from '../../services/api'

export default function AIStatusIndicator() {
  const { systemStatus, cameraActive, aiActive } = useApp()
  const [testingVoice, setTestingVoice] = useState(false)
  const isOnline = systemStatus === SYSTEM_STATUS.ONLINE || systemStatus === SYSTEM_STATUS.PROCESSING

  const items = [
    { label: 'Backend', icon: isOnline ? Wifi : WifiOff, active: isOnline },
    { label: 'Camera', icon: Camera, active: cameraActive },
    { label: 'Face Recognition', icon: Eye, active: aiActive },
    { label: 'Object Detection', icon: Cpu, active: aiActive },
  ]

  const testVoice = async () => {
    setTestingVoice(true)
    try {
      await testVoiceAnnouncement()
      toast.success('Voice test queued')
    } catch (error) {
      toast.error(error.message || 'Could not test the voice announcer')
    } finally {
      setTestingVoice(false)
    }
  }

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-[#263449] bg-[#111a27]/80 p-5 sm:p-6">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">System health</h2>
        <button onClick={testVoice} disabled={testingVoice} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300 transition-colors hover:bg-emerald-400/20 disabled:opacity-50">
          <Volume2 size={11} /> {testingVoice ? 'Testing…' : 'Test voice'}
        </button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
        {items.map(({ label, icon: Icon, active }) => (
          <div key={label} className="flex min-w-0 items-center justify-between rounded-xl bg-[#172235] px-3 py-3">
            <div className="flex items-center gap-2.5">
              <Icon size={14} className={active ? 'text-green-400' : 'text-slate-600'} />
              <span className="truncate text-xs text-slate-400">{label}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className={`text-[11px] font-medium ${active ? 'text-green-400' : 'text-slate-600'}`}>
                {active ? 'Active' : 'Offline'}
              </span>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}
