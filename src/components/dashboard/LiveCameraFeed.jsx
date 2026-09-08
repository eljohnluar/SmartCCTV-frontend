import { Camera, Maximize2, Pause, Play, Radio, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useApp } from '../../context/AppContext'

const streamUrl = '/api/camera/stream'

export default function LiveCameraFeed() {
  const [streamKey, setStreamKey] = useState(0)
  const [failed, setFailed] = useState(false)
  const { cameraActive, attendanceRecording, updateAttendanceRecording } = useApp()
  const [streamReady, setStreamReady] = useState(false)
  const [recordingBusy, setRecordingBusy] = useState(false)

  const reconnect = () => {
    setFailed(false)
    setStreamReady(false)
    setStreamKey((key) => key + 1)
  }

  const toggleAttendanceRecording = async () => {
    setRecordingBusy(true)
    try {
      await updateAttendanceRecording(!attendanceRecording)
    } catch (error) {
      // The API explains when OBS Virtual Camera is not ready.
      toast.error(error.message || 'Could not change attendance recording state')
    } finally {
      setRecordingBusy(false)
    }
  }

  const cameraReady = cameraActive || streamReady

  return (
    <section className="overflow-hidden rounded-3xl border border-[#2b3b51] bg-[#111a27] shadow-[0_20px_55px_rgba(0,0,0,0.22)]">
      <div className="flex items-center justify-between px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <Camera size={17} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Live camera feed</h2>
            <p className="text-[11px] text-slate-500">OBS Virtual Camera · Main entrance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide sm:inline-flex ${cameraActive ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300' : 'border-slate-600/40 text-slate-500'}`}>
            <Radio size={11} className={cameraActive ? 'animate-pulse' : ''} /> {cameraActive ? 'Live' : 'Offline'}
          </span>
          <button
            onClick={toggleAttendanceRecording}
            disabled={!cameraReady || recordingBusy}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${attendanceRecording ? 'bg-red-400/10 text-red-300 hover:bg-red-400/20' : 'bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20'}`}
          >
            {attendanceRecording ? <Pause size={12} /> : <Play size={12} />}
            {attendanceRecording ? 'Pause attendance' : 'Record attendance'}
          </button>
          <button onClick={reconnect} aria-label="Reconnect camera stream" className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>
      <div className="relative aspect-video overflow-hidden bg-[#080d15] xl:aspect-[16/8]">
        {!failed && (
          <img
            key={streamKey}
            src={`${streamUrl}?refresh=${streamKey}`}
            alt="Live OBS Virtual Camera feed"
            onLoad={() => setStreamReady(true)}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
        {!failed && (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/45 to-transparent" />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-md bg-black/50 px-2 py-1 font-mono text-[10px] tracking-wide text-white/85 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> REC 01
            </div>
            <div className="absolute bottom-4 left-4 rounded-md bg-black/45 px-2 py-1 font-mono text-[10px] text-white/75 backdrop-blur-sm">CAM 01 · 1080P</div>
            <Maximize2 size={15} className="absolute bottom-4 right-4 text-white/70" />
          </>
        )}
        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-slate-500">
            <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/70"><Camera size={23} /></div>
            <p className="text-sm font-medium text-slate-300">Camera stream is unavailable</p>
            <p className="max-w-sm text-xs">Confirm OBS Virtual Camera is running and CAMERA_INDEX is correct.</p>
            <button onClick={reconnect} className="mt-2 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-400/20">Try reconnecting</button>
          </div>
        )}
      </div>
    </section>
  )
}
