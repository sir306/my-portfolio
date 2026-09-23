// Game audio: looping background music plus one-shot sound effects, with a mute toggle.
//
// Browsers block audio until the visitor has interacted with the page, so if the music
// can't start straight away it starts on the first key press, click or tap instead.
const RETRY_EVENTS = ['keydown', 'pointerdown']

export function createSounds({ music, effects = {}, Audio = globalThis.Audio, target = globalThis } = {}) {
  const track = new Audio(music)
  track.loop = true
  const clips = Object.fromEntries(Object.entries(effects).map(([name, src]) => [name, new Audio(src)]))
  const elements = [track, ...Object.values(clips)]

  let muted = false
  let wantMusic = false
  let destroyed = false

  function removeRetry() {
    for (const type of RETRY_EVENTS) target.removeEventListener(type, retryMusic)
  }

  function retryMusic() {
    removeRetry()
    if (!muted && !destroyed) track.play().catch(() => {})
  }

  function startMusic() {
    wantMusic = true
    track.play().catch(() => {
      if (destroyed) return
      for (const type of RETRY_EVENTS) target.addEventListener(type, retryMusic)
    })
  }

  function play(name) {
    const clip = clips[name]
    if (!clip || muted || destroyed) return
    clip.currentTime = 0
    clip.play().catch(() => {})
  }

  function toggleMute() {
    muted = !muted
    for (const el of elements) el.muted = muted
    // The key press that unmutes lets the browser play music it blocked earlier.
    if (!muted && wantMusic && !destroyed && track.paused) {
      removeRetry()
      track.play().catch(() => {})
    }
    return muted
  }

  function destroy() {
    destroyed = true
    removeRetry()
    for (const el of elements) el.pause()
  }

  return { elements, startMusic, play, toggleMute, destroy }
}
