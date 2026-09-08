import { useState } from 'react'
import { Camera, Cpu, Volume2, Database, Sliders, Save, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const SETTINGS_STORAGE_KEY = 'smartcctv.settings'

const defaultSettings = {
  cameraIndex: 1,
  cameraFps: 15,
  enrollmentCamera: 'webcam',
  recognitionThreshold: 0.45,
  recognitionModel: 'Facenet',
  voiceLanguage: 'en',
  voiceEnabled: true,
  weaponDetectionEnabled: true,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co',
  logLevel: 'INFO',
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

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    setSaving(true)
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    setTimeout(() => {
      setSaving(false)
      toast.success('System configuration saved successfully')
    }, 600)
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
              <h2 className="text-sm font-semibold text-white">Camera & OBS Virtual Camera Feed</h2>
              <p className="text-xs text-slate-500">Configure virtual webcam device input stream</p>
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
              <p className="text-[11px] text-slate-500 mt-1">Default 1 is usually OBS Virtual Camera on Windows.</p>
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
                <option value="virtual">OBS Virtual Camera</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Browser webcam requests permission. OBS Virtual Camera uses the same Yi IoT window feed as live monitoring.
              </p>
            </div>
          </div>
        </div>

        {/* AI & Recognition Parameters */}
        <div className="bg-[#1a1d27] border border-[#2d3148] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
              <Cpu size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">AI Detection & Recognition Pipeline</h2>
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

            <div className="sm:col-span-2 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.weaponDetectionEnabled}
                  onChange={(e) => handleChange('weaponDetectionEnabled', e.target.checked)}
                  className="w-4 h-4 rounded bg-[#242836] border-[#2d3148] accent-green-500"
                />
                <span className="text-sm text-slate-300">Enable YOLO real-time weapon & security threat detection</span>
              </label>
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
              <p className="text-xs text-slate-500">Text-to-speech feedback via gTTS</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.voiceEnabled}
                onChange={(e) => handleChange('voiceEnabled', e.target.checked)}
                className="w-4 h-4 rounded bg-[#242836] border-[#2d3148] accent-green-500"
              />
              <span className="text-sm text-slate-300">Play voice announcement on student check-in and security alarms</span>
            </label>

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
