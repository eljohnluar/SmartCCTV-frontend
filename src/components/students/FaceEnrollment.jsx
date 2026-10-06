import { Camera, Check, Video, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { API_BASE_URL, enrollFace, getGestureAttendanceSettings } from '../../services/api'
import { usePasswordConfirm } from '../../hooks/usePasswordConfirm'
import { enrollmentCameraOf, readStoredSettings, cameraSourceLabel } from '../../utils/settings'
import Modal from '../common/Modal'

const virtualCameraStream = `${API_BASE_URL}/camera/stream`
const CAPTURE_STEPS = [
  { id: 'front', label: 'Front', instruction: 'Look straight at the camera.' },
  { id: 'left', label: 'Turn left', instruction: 'Turn your face slightly to the left.' },
  { id: 'right', label: 'Turn right', instruction: 'Turn your face slightly to the right.' },
  { id: 'upward', label: 'Look up', instruction: 'Tilt your face slightly upward.' },
]

export default function FaceEnrollment({ open, onClose, student }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [cameraSource, setCameraSource] = useState('webcam')
  const [virtualStreamKey, setVirtualStreamKey] = useState(0)
  const [streaming, setStreaming] = useState(false)
  const [sourceError, setSourceError] = useState('')
  const [captures, setCaptures] = useState({})
  const [enrolling, setEnrolling] = useState(false)
  const [gestureRequired, setGestureRequired] = useState(false)
  const { confirm, dialog } = usePasswordConfirm()

  const activeStep = CAPTURE_STEPS.find((step) => !captures[step.id])
  const captureCount = Object.keys(captures).length
  const isComplete = captureCount === CAPTURE_STEPS.length
  const isBackendStream = cameraSource !== 'webcam'
  const sourceLabel = cameraSourceLabel(cameraSource)

  useEffect(() => {
    if (open) {
      setCameraSource(enrollmentCameraOf(readStoredSettings()))
      setSourceError('')
      setCaptures({})
      getGestureAttendanceSettings()
        .then((data) => setGestureRequired(Boolean(data.gesture_attendance_enabled)))
        .catch(() => setGestureRequired(false))
    }
  }, [open])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setStreaming(false)
  }, [])

  const startCamera = useCallback(async () => {
    setSourceError('')
    if (isBackendStream) {
      setVirtualStreamKey((key) => key + 1)
      setStreaming(true)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setStreaming(true)
    } catch {
      setSourceError('Browser webcam access was denied or is unavailable.')
      toast.error('Camera access denied')
    }
  }, [cameraSource, isBackendStream])

  const capture = async () => {
    if (!activeStep) return
    const canvas = canvasRef.current
    if (!canvas) return

    let source
    let width
    let height
    if (isBackendStream) {
      // The MJPEG preview is a cross-origin image, and drawing it taints the
      // canvas so toDataURL() throws. Take the same frame from the backend
      // instead: a fetched blob is same-origin and stays exportable.
      try {
        const response = await fetch(`${API_BASE_URL}/camera/snapshot`, { cache: 'no-store' })
        if (!response.ok) throw new Error(`Camera snapshot returned ${response.status}`)
        source = await createImageBitmap(await response.blob())
        width = source.width
        height = source.height
      } catch (error) {
        toast.error('The camera frame could not be captured. Start the camera feed and try again.')
        console.error('[FaceEnrollment] Snapshot capture failed:', error)
        return
      }
    } else {
      source = videoRef.current
      width = source?.videoWidth
      height = source?.videoHeight
    }

    if (!width || !height) {
      source?.close?.()
      toast.error('Wait for the camera image to load before capturing.')
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      source?.close?.()
      return
    }

    canvas.width = width
    canvas.height = height
    let image
    try {
      context.drawImage(source, 0, 0, width, height)
      image = canvas.toDataURL('image/jpeg', 0.9)
    } catch (error) {
      toast.error('The camera image could not be captured by this browser.')
      console.error('[FaceEnrollment] Canvas capture failed:', error)
      return
    } finally {
      source?.close?.()
    }

    setCaptures((previous) => ({ ...previous, [activeStep.id]: image }))
    if (captureCount + 1 === CAPTURE_STEPS.length) stopCamera()
  }

  const retake = (stepId) => {
    setCaptures((previous) => {
      const next = { ...previous }
      delete next[stepId]
      return next
    })
    if (!streaming) startCamera()
  }

  const enroll = async () => {
    if (!isComplete || !student) return
    setEnrolling(true)
    try {
      const formData = new FormData()
      formData.append('student_id', student.id)
      for (const step of CAPTURE_STEPS) {
        const blob = await fetch(captures[step.id]).then((response) => response.blob())
        formData.append('images', blob, `${step.id}.jpg`)
      }
      const done = await confirm((password) => enrollFace(formData, password), {
        title: 'Confirm face enrollment',
        description: `Enrolling four face angles for ${student.full_name} replaces any existing facial samples. Enter your password to continue.`,
        confirmLabel: 'Enroll face',
      })
      if (!done) return
      toast.success(`Four face angles enrolled for ${student.full_name}`)
      handleClose()
    } catch (error) {
      toast.error(error.message || 'Enrollment failed')
    } finally {
      setEnrolling(false)
    }
  }

  const handleClose = () => {
    stopCamera()
    setCaptures({})
    setSourceError('')
    onClose()
  }

  return (
    <>
    <Modal open={open} onClose={handleClose} title={`Four-angle face enrollment — ${student?.full_name ?? ''}`} size="md">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 rounded-lg border border-[#2d3148] bg-[#172235] px-3 py-2 text-xs text-slate-300">
          <span className="flex items-center gap-2">
            {isBackendStream ? <Video size={14} className="text-emerald-300" /> : <Camera size={14} className="text-emerald-300" />}
            Source: <strong className="font-medium text-white">{sourceLabel}</strong>
          </span>
          <span className="font-medium text-emerald-300">{captureCount}/4 captured</span>
        </div>

        {!isComplete && (
          <>
            <div className="rounded-lg bg-emerald-400/10 px-3 py-2 text-center">
              <p className="text-sm font-medium text-emerald-200">{activeStep.label}</p>
              <p className="mt-0.5 text-xs text-emerald-300/75">{activeStep.instruction}{gestureRequired ? ' Keep an open palm visible beside your face.' : ''}</p>
            </div>
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-[#0f1117]">
              {!streaming && <div className="px-5 text-center text-slate-600">{sourceError ? <p className="text-sm text-red-300">{sourceError}</p> : <><Camera size={32} className="mx-auto mb-2" /><p className="text-sm">Camera not started</p></>}</div>}
              <video ref={videoRef} autoPlay playsInline muted className={`h-full w-full object-cover ${cameraSource === 'webcam' && streaming ? 'block' : 'hidden'}`} />
              <img src={isBackendStream && streaming ? `${virtualCameraStream}?enrollment=${student?.id ?? 'face'}&refresh=${virtualStreamKey}` : undefined} alt={`${sourceLabel} enrollment preview`} onError={() => { setStreaming(false); setSourceError(`${sourceLabel} is unavailable. Start the camera feed, then try again.`) }} className={`h-full w-full object-cover ${isBackendStream && streaming ? 'block' : 'hidden'}`} />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </>
        )}

        {isComplete && <p className="rounded-lg bg-green-500/10 px-3 py-2 text-center text-sm text-green-300">All four angles are ready. Review or retake a capture before enrolling{gestureRequired ? '—each image must include an open palm' : ''}.</p>}

        <div className="grid grid-cols-4 gap-2">
          {CAPTURE_STEPS.map((step) => (
            <button key={step.id} onClick={() => captures[step.id] && retake(step.id)} disabled={!captures[step.id] || enrolling} title={captures[step.id] ? `Retake the ${step.label.toLowerCase()} capture` : `Waiting for the ${step.label.toLowerCase()} capture — use the capture button below`} className={`relative aspect-square overflow-hidden rounded-lg border text-[10px] transition-colors ${captures[step.id] ? 'border-emerald-400/40 hover:border-emerald-300' : 'border-[#2d3148] bg-[#172235] text-slate-500'} disabled:cursor-default`}>
              {captures[step.id] ? <img src={captures[step.id]} alt={`${step.label} face capture`} className="h-full w-full object-cover" /> : <span>{step.label}</span>}
              {captures[step.id] && <span className="absolute inset-x-0 bottom-0 bg-black/65 py-1 text-white">{step.label} · Retake</span>}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {!streaming && !isComplete && <button onClick={startCamera} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500/10 py-2.5 text-sm font-medium text-green-400 transition-colors hover:bg-green-500/20">{isBackendStream ? <Video size={16} /> : <Camera size={16} />}{isBackendStream ? 'Connect camera feed' : 'Start Webcam'}</button>}
          {streaming && activeStep && <button onClick={capture} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 py-2.5 text-sm font-medium text-black transition-colors hover:bg-green-400"><Camera size={16} />Capture {activeStep.label}</button>}
          {isComplete && <button onClick={enroll} disabled={enrolling} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 py-2.5 text-sm font-medium text-black transition-colors hover:bg-green-400 disabled:opacity-50"><Check size={16} />{enrolling ? 'Enrolling...' : 'Enroll 4 Face Angles'}</button>}
          <button onClick={handleClose} className="rounded-lg bg-[#242836] p-2.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-red-400" aria-label="Close enrollment"><X size={16} /></button>
        </div>
      </div>
    </Modal>
    {dialog}
    </>
  )
}
