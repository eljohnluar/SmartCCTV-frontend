export const SETTINGS_STORAGE_KEY = 'smartcctv.settings'

export function readStoredSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

/** Which camera the dashboard live window shows: the server's virtual camera stream or this device's browser webcam. */
export function liveFeedCameraOf(settings) {
  return settings.liveFeedCamera === 'webcam' ? 'webcam' : 'virtual'
}

export function enrollmentCameraOf(settings) {
  return settings.enrollmentCamera === 'virtual' ? 'virtual' : 'webcam'
}
