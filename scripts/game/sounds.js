// Game audio: looping background music plus one-shot sound effects, with a mute toggle.
//
// Browsers block audio until the visitor has interacted with the page, so if the music
// can't start straight away it starts on the first key press, click or tap instead.
// Not every interaction counts (Esc, Shift, or the start of a touch don't), so keep
// listening until the music really plays. Taps count on pointerup, clicks on pointerdown.
const RETRY_EVENTS = ['keydown', 'pointerdown', 'pointerup']

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
    if (muted || destroyed) return
    track.play().then(removeRetry, () => {})
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
      track.play().then(removeRetry, () => {})
    }
    return muted
  }

  function destroy() {
    destroyed = true
    removeRetry()
    for (const el of elements) {
      el.pause()
      // Dropping the source stops any download still in progress.
      el.removeAttribute('src')
      el.load()
    }
  }

  return { elements, startMusic, play, toggleMute, destroy }
}
