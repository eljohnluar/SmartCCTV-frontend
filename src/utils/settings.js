export const SETTINGS_STORAGE_KEY = 'smartcctv.settings'

export function readStoredSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

const CAMERA_SOURCES = ['webcam', 'virtual', 'obs', 'rtsp']

/** Which camera the dashboard live window shows: browser webcam, backend stream (virtual), or a bridge-fed source (obs/rtsp via the backend). */
export function liveFeedCameraOf(settings) {
  const value = settings.liveFeedCamera
  return CAMERA_SOURCES.includes(value) ? value : 'virtual'
}

export function enrollmentCameraOf(settings) {
  const value = settings.enrollmentCamera
  return CAMERA_SOURCES.includes(value) ? value : 'webcam'
}

export function cameraSourceLabel(source) {
  return {
    webcam: 'Browser webcam',
    virtual: 'Local backend feed',
    obs: 'OBS Studio',
    rtsp: 'Wired camera (RTSP)',
  }[source] ?? 'Camera'
}
