import { useEffect, useState } from 'react'
import { Camera, Cpu, Volume2, Database, Palette, Save, Check, Hand, FlipHorizontal, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'
import { getGestureAttendanceSettings, getRuntimeControls, getUniformPolicy, getVoiceSettings, updateGestureAttendanceSettings, updateRuntimeControls, updateUniformPolicy, updateVoiceSettings } from '../services/api'

const SETTINGS_STORAGE_KEY = 'smartcctv.settings'

const defaultSettings = {
  cameraIndex: 1,
  cameraFps: 15,
  enrollmentCamera: 'webcam',
  recognitionThreshold: 0.45,
  recognitionModel: 'Facenet',
  voiceLanguage: 'en',
  announcerEnabled: true,
  announcerVolume: 100,
  alertModeEnabled: true,
  cameraFlipHorizontal: false,
  voiceGender: 'female',
  weaponDetectionEnabled: true,
  gestureAttendanceEnabled: false,
  uniformColors: [],
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co',
  logLevel: 'INFO',
}

/** Pill-style On/Off toggle button */
function ToggleButton({ value, onChange, onLabel = 'On', offLabel = 'Off' }) {
  return (
    <div className="inline-flex rounded-lg border border-[#2d3148] overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`px-4 py-1.5 text-xs font-semibold transition-colors ${
          value
            ? 'bg-green-500 text-black'
            : 'bg-[#242836] text-slate-400 hover:text-white'
        }`}
      >
        {onLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`px-4 py-1.5 text-xs font-semibold transition-colors ${
          !value
            ? 'bg-red-500/80 text-white'
            : 'bg-[#242836] text-slate-400 hover:text-white'
        }`}
      >
        {offLabel}
      </button>
    </div>
  )
}

export default function Settings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}')
      return { ...defaultSettings, ...saved }
    } catch {
      return defaultSettings
    }
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getUniformPolicy()
      .then((policy) => setSettings((previous) => ({ ...previous, uniformColors: policy.uniform_colors || [] })))
      .catch(() => {})
    getVoiceSettings()
      .then((voice) => setSettings((previous) => ({ ...previous, voiceGender: voice.voice_gender || 'female' })))
      .catch(() => {})
    getGestureAttendanceSettings()
      .then((gesture) => setSettings((previous) => ({
        ...previous,
        gestureAttendanceEnabled: Boolean(gesture.gesture_attendance_enabled),
      })))
      .catch(() => {})
    getRuntimeControls()
      .then((controls) => setSettings((previous) => ({
        ...previous,
        cameraFlipHorizontal: Boolean(controls.camera_flip_horizontal),
        announcerEnabled: Boolean(controls.announcer_enabled),
        announcerVolume: controls.announcer_volume ?? 100,
        alertModeEnabled: Boolean(controls.alert_mode_enabled),
      })))
      .catch(() => {})
  }, [])

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateUniformPolicy(settings.uniformColors)
      await updateVoiceSettings(settings.voiceGender)
      await updateGestureAttendanceSettings(settings.gestureAttendanceEnabled)
      await updateRuntimeControls({
        camera_flip_horizontal: settings.cameraFlipHorizontal,
        announcer_enabled: settings.announcerEnabled,
        announcer_volume: settings.announcerVolume,
        alert_mode_enabled: settings.alertModeEnabled,
      })
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
      toast.success('System configuration saved successfully')
    } catch (error) {
      toast.error(error.message || 'Could not save the uniform policy')
    } finally {
      setSaving(false)
    }
  }

  const toggleUniformColor = (color) => {
    handleChange('uniformColors', settings.uniformColors.includes(color)
      ? settings.uniformColors.filter((selected) => selected !== color)
      : [...settings.uniformColors, color])
  }

  return (
    <div className="max-w-4xl space-y-6">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Camera Integration Card */}
        <div className="bg-[#1a1d27] border border-[#2d3148] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
              <Camera size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Camera &amp; Live Feed</h2>
              <p className="text-xs text-slate-500">Configure camera device input stream</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Camera Index / Device ID
              </label>
              <input
                type="number"
                value={settings.cameraIndex}
                onChange={(e) => handleChange('cameraIndex', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm bg-[#242836] border border-[#2d3148] rounded-lg text-slate-200 focus:outline-none focus:border-green-500/50"
              />
              <p className="text-[11px] text-slate-500 mt-1">Default 1 is usually a virtual camera device on Windows.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Target Capture FPS
              </label>
              <input
                type="number"
                value={settings.cameraFps}
                onChange={(e) => handleChange('cameraFps', parseInt(e.target.value) || 15)}
                className="w-full px-3 py-2 text-sm bg-[#242836] border border-[#2d3148] rounded-lg text-slate-200 focus:outline-none focus:border-green-500/50"
              />
              <p className="text-[11px] text-slate-500 mt-1">15 FPS recommended for optimal processing balance.</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Face Enrollment Camera
              </label>
              <select
                value={settings.enrollmentCamera}
                onChange={(e) => handleChange('enrollmentCamera', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#242836] border border-[#2d3148] rounded-lg text-slate-200 focus:outline-none focus:border-green-500/50"
              >
                <option value="webcam">Browser webcam</option>
                <option value="virtual">Virtual Camera</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Browser webcam requests permission. Virtual Camera uses the same live window feed as live monitoring.
              </p>
            </div>

            {/* Camera Flip Toggle */}
            <div className="sm:col-span-2 flex items-center justify-between rounded-lg border border-[#2d3148] bg-[#242836] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <FlipHorizontal size={16} className="text-emerald-400" />
                <div>
                  <span className="text-sm text-slate-300">Flip camera horizontally (left ↔ right)</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Mirror the live camera feed left to right.</p>
                </div>
              </div>
              <ToggleButton
                value={settings.cameraFlipHorizontal}
                onChange={(v) => handleChange('cameraFlipHorizontal', v)}
              />
            </div>
          </div>
        </div>

        {/* Gesture confirmation */}
        <div className="bg-[#1a1d27] border border-[#2d3148] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-400"><Hand size={18} /></div>
            <div>
              <h2 className="text-sm font-semibold text-white">Hand Gesture Confirmation</h2>
              <p className="text-xs text-slate-500">Require an open palm when enrolling or re-enrolling a student's face.</p>
            </div>
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#2d3148] bg-[#242836] p-4">
            <input
              type="checkbox"
              checked={settings.gestureAttendanceEnabled}
              onChange={(e) => handleChange('gestureAttendanceEnabled', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded bg-[#242836] border-[#2d3148] accent-green-500"
            />
            <span>
              <span className="block text-sm text-slate-200">Enroll with open-palm confirmation</span>
              <span className="mt-1 block text-[11px] text-slate-500">Students enrolled while this is enabled must show an open palm at the live camera before attendance is recorded. Students enrolled without it check in normally.</span>
            </span>
          </label>
        </div>

        {/* Uniform Policy */}
        <div className="bg-[#1a1d27] border border-[#2d3148] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
              <Palette size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Student Uniform Policy</h2>
              <p className="text-xs text-slate-500">Only enrolled students are checked after face recognition.</p>
            </div>
          </div>

          <fieldset>
            <legend className="block text-xs font-medium text-slate-400 mb-3">Allowed uniform clothing colors</legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { value: 'dark-blue',  label: 'Dark Blue',  dot: 'bg-blue-900 border border-blue-700' },
                { value: 'light-blue', label: 'Light Blue', dot: 'bg-blue-400' },
                { value: 'dark-red',   label: 'Dark Red',   dot: 'bg-red-900 border border-red-700' },
                { value: 'light-red',  label: 'Light Red',  dot: 'bg-red-400' },
                { value: 'white',      label: 'White',      dot: 'bg-white' },
                { value: 'black',      label: 'Black',      dot: 'bg-black border border-slate-600' },
              ].map((color) => (
                <label key={color.value} className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#2d3148] bg-[#242836] px-3 py-2.5 text-sm text-slate-300 transition-colors hover:border-green-500/40">
                  <input
                    type="checkbox"
                    checked={settings.uniformColors.includes(color.value)}
                    onChange={() => toggleUniformColor(color.value)}
                    className="h-4 w-4 rounded bg-[#242836] border-[#2d3148] accent-green-500"
                  />
                  <span className={`h-3 w-3 rounded-full flex-shrink-0 ${color.dot}`} />
                  {color.label}
                </label>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-500">A recognized enrolled student wearing an unselected color triggers a policy alert and voice announcement. No clothing boxes are shown in the camera feed.</p>
            {settings.uniformColors.length === 0 && <p className="mt-2 text-[11px] text-amber-300">No colors are allowed yet—every detected clothing color will be treated as a policy violation.</p>}
          </fieldset>
        </div>

        {/* AI & Recognition Parameters */}
        <div className="bg-[#1a1d27] border border-[#2d3148] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
              <Cpu size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">AI Detection &amp; Recognition Pipeline</h2>
              <p className="text-xs text-slate-500">Face recognition matching and threat heuristics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Recognition Threshold ({(settings.recognitionThreshold * 100).toFixed(0)}%)
              </label>
              <input
                type="range"
                min="0.3"
                max="0.99"
                step="0.01"
                value={settings.recognitionThreshold}
                onChange={(e) => handleChange('recognitionThreshold', parseFloat(e.target.value))}
                className="w-full accent-green-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>0.30 (Permissive)</span>
                <span>0.45 (Recommended)</span>
                <span>0.99 (Strict)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                DeepFace Backbone Model
              </label>
              <select
                value={settings.recognitionModel}
                onChange={(e) => handleChange('recognitionModel', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#242836] border border-[#2d3148] rounded-lg text-slate-200 focus:outline-none focus:border-green-500/50"
              >
                <option value="Facenet">Facenet (128-d embeddings)</option>
                <option value="Facenet512">Facenet-512 (512-d embeddings)</option>
                <option value="VGG-Face">VGG-Face</option>
                <option value="ArcFace">ArcFace</option>
              </select>
            </div>

            {/* Alert Mode Toggle */}
            <div className="sm:col-span-2 flex items-center justify-between rounded-lg border border-[#2d3148] bg-[#242836] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <ShieldAlert size={16} className={settings.alertModeEnabled ? 'text-red-400' : 'text-slate-500'} />
                <div>
                  <span className="text-sm text-slate-300">Security alert mode</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Real-time threat detection and security alerts.</p>
                </div>
              </div>
              <ToggleButton
                value={settings.alertModeEnabled}
                onChange={(v) => handleChange('alertModeEnabled', v)}
              />
            </div>
          </div>
        </div>

        {/* Audio & Announcements */}
        <div className="bg-[#1a1d27] border border-[#2d3148] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
              <Volume2 size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Voice Announcement Engine</h2>
              <p className="text-xs text-slate-500">Text-to-speech feedback through the system voice</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Announcer On/Off */}
            <div className="flex items-center justify-between rounded-lg border border-[#2d3148] bg-[#242836] px-4 py-3">
              <div>
                <span className="text-sm text-slate-300">Voice announcer</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Announce attendance check-ins and security alerts aloud.</p>
              </div>
              <ToggleButton
                value={settings.announcerEnabled}
                onChange={(v) => handleChange('announcerEnabled', v)}
              />
            </div>

            {/* Volume slider */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Announcer volume ({settings.announcerVolume}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.announcerVolume}
                onChange={(e) => handleChange('announcerVolume', Number(e.target.value))}
                disabled={!settings.announcerEnabled}
                className="w-full accent-green-500 disabled:opacity-40"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Voice Language
              </label>
              <select
                value={settings.voiceLanguage}
                onChange={(e) => handleChange('voiceLanguage', e.target.value)}
                className="w-full sm:w-64 px-3 py-2 text-sm bg-[#242836] border border-[#2d3148] rounded-lg text-slate-200 focus:outline-none focus:border-green-500/50"
              >
                <option value="en">English (US)</option>
                <option value="tl">Filipino (Tagalog)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Announcer Voice
              </label>
              <select
                value={settings.voiceGender}
                onChange={(e) => handleChange('voiceGender', e.target.value)}
                className="w-full sm:w-64 px-3 py-2 text-sm bg-[#242836] border border-[#2d3148] rounded-lg text-slate-200 focus:outline-none focus:border-green-500/50"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">Uses the closest installed voice of the selected gender.</p>
            </div>
          </div>
        </div>

        {/* Database & Supabase */}
        <div className="bg-[#1a1d27] border border-[#2d3148] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
              <Database size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Supabase Connection</h2>
              <p className="text-xs text-slate-500">PostgreSQL, Realtime, and Storage configuration</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Supabase Project URL
            </label>
            <input
              type="text"
              readOnly
              value={settings.supabaseUrl}
              className="w-full px-3 py-2 text-sm bg-[#242836] border border-[#2d3148] rounded-lg text-slate-400 cursor-not-allowed font-mono text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1">Configured in frontend/.env (VITE_SUPABASE_URL)</p>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-green-500 text-black rounded-lg hover:bg-green-400 disabled:opacity-50 transition-colors"
          >
            {saving ? <Check size={16} /> : <Save size={16} />}
            {saving ? 'Saving Changes...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  )
}
