import { describe, test, beforeEach, afterEach, mock } from 'node:test'
import assert from 'node:assert/strict'

import { run } from '../scripts/spaceinvaders.js'

// A small fake browser, just enough for the game to run in Node.
const BROWSER_GLOBALS = ['Image', 'document', 'innerWidth', 'innerHeight', 'addEventListener', 'removeEventListener', 'requestAnimationFrame', 'cancelAnimationFrame']

// Images only "finish loading" when the test says so, like a real network fetch.
class FakeImage {
  static pending = []
  constructor() {
    FakeImage.pending.push(this)
  }
  set src(url) {
    ;[this.width, this.height] = url.includes('spaceship') ? [400, 300] : [30, 30]
  }
}
function loadImages() {
  for (const image of FakeImage.pending.splice(0)) image.onload?.()
}

// Every drawing call on the 2D canvas context is a no-op.
const context = new Proxy({}, { get: () => () => {}, set: () => true })

// Deterministic Math.random, so each run plays out the same way.
function seededRandom(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

let page, queuedFrames, sounds, cleanup, realRandom

beforeEach(() => {
  realRandom = Math.random
  Math.random = seededRandom(42)
  mock.timers.enable({ apis: ['setTimeout'] })
  FakeImage.pending = []
  page = new EventTarget()
  queuedFrames = []
  const elements = new Map()
  Object.assign(globalThis, {
    Image: FakeImage,
    document: {
      getElementById(id) {
        if (!elements.has(id)) {
          elements.set(id, id === 'space-canvas' ? { style: {}, getContext: () => context } : { style: {}, textContent: '' })
        }
        return elements.get(id)
      },
    },
    innerWidth: 1280,
    innerHeight: 800,
    addEventListener: page.addEventListener.bind(page),
    removeEventListener: page.removeEventListener.bind(page),
    requestAnimationFrame: (callback) => queuedFrames.push(callback),
    cancelAnimationFrame: () => {},
  })
  sounds = {
    played: [],
    toggles: 0,
    play(name) { this.played.push(name) },
    toggleMute() { this.toggles++ },
  }
  cleanup = run({ sounds })
  loadImages() // the ship has loaded by the time anyone presses Enter
})

afterEach(() => {
  cleanup?.()
  mock.timers.reset()
  Math.random = realRandom
  for (const name of BROWSER_GLOBALS) delete globalThis[name]
})

function press(key, extra = {}) {
  page.dispatchEvent(Object.assign(new Event('keydown'), { key, repeat: false, ...extra }))
}
function release(key) {
  page.dispatchEvent(Object.assign(new Event('keyup'), { key }))
}
function tap(key) {
  press(key)
  release(key)
}
function runQueuedFrames() {
  for (const callback of queuedFrames.splice(0)) callback()
}
// One animation frame, then new images load and 16 ms of timers run, as between real frames.
function frame() {
  runQueuedFrames()
  loadImages()
  mock.timers.tick(16)
}

describe('space invaders game loop', () => {
  test('keeps running when a shot is in flight while new invaders are still loading', () => {
    tap('Enter') // the first frame spawns a wave whose images haven't loaded yet
    tap(' ')
    assert.doesNotThrow(runQueuedFrames)
  })
})
