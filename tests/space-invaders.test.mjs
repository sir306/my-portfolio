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

// Drawing calls on the 2D canvas context do nothing but are counted, by method name.
const drawn = {}
const context = new Proxy({}, { get: (_, method) => () => { drawn[method] = (drawn[method] ?? 0) + 1 }, set: () => true })
const drawCount = () => Object.values(drawn).reduce((sum, n) => sum + n, 0)

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
  for (const method of Object.keys(drawn)) delete drawn[method]
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
const count = (name) => sounds.played.filter((played) => played === name).length

describe('space invaders sounds', () => {
  test('Enter plays the start sound', () => {
    tap('Enter')
    assert.deepEqual(sounds.played, ['start'])
  })

  test('firing plays the shoot sound during a game but not on the start menu', () => {
    tap(' ')
    assert.deepEqual(sounds.played, [])
    tap('Enter')
    tap(' ')
    assert.deepEqual(sounds.played, ['start', 'shoot'])
  })

  test('Esc plays the select sound when pausing and resuming', () => {
    tap('Enter')
    tap('Escape')
    tap('Escape')
    assert.deepEqual(sounds.played, ['start', 'select', 'select'])
  })

  test('M toggles mute on the start menu and mid-game, ignoring a held key', () => {
    tap('m')
    press('m', { repeat: true })
    assert.equal(sounds.toggles, 1)
    tap('Enter')
    tap('M')
    assert.equal(sounds.toggles, 2)
    assert.deepEqual(sounds.played, ['start'], 'M does nothing else')
  })

  test('destroying invaders, invaders firing and losing each play their sound', () => {
    tap('Enter')
    // Shoot for a while, then stop so the invaders can come down, fire back and win.
    for (let n = 0; n < 600; n++) {
      if (n % 8 === 0) tap(' ')
      frame()
    }
    for (let n = 0; n < 20000 && count('gameOver') === 0; n++) frame()
    // gameOver() runs again on later frames; the sound must not repeat
    for (let n = 0; n < 300; n++) frame()

    assert.ok(count('explode') > 0, 'an invader was destroyed')
    assert.ok(count('enemyShoot') > 0, 'an invader fired')
    assert.equal(count('gameOver'), 1)

    tap('m')
    assert.equal(sounds.toggles, 1, 'M works on the game over screen')
  })

  test('invaders reaching the ship play the game over sound only once', () => {
    cleanup()
    globalThis.innerHeight = 150 // a short screen, so the invaders reach the ship quickly
    cleanup = run({ sounds })
    loadImages()
    tap('Enter')
    for (let n = 0; n < 5000 && count('gameOver') === 0; n++) frame()
    for (let n = 0; n < 100; n++) frame() // gameOver() keeps running while the invaders overlap the ship
    assert.equal(document.getElementById('gameOverReasonEl').textContent, 'You let the invaders get past you!')
    assert.equal(count('gameOver'), 1)
  })

  const loopSounds = (from) => sounds.played.slice(from).filter((name) => name === 'enemyShoot' || name === 'explode')

  test('nothing plays while paused', () => {
    tap('Enter')
    for (let n = 0; n < 5000 && count('enemyShoot') === 0; n++) {
      if (n % 8 === 0) tap(' ')
      frame()
    }
    tap('Escape')
    const pausedAt = sounds.played.length
    for (let n = 0; n < 600; n++) {
      if (n % 8 === 0) tap(' ')
      frame()
    }
    assert.deepEqual(sounds.played.slice(pausedAt), [])
  })

  // The game keeps animating behind the game over menu (as on the live site), and
  // invaders keep firing there, so their sound has to check the game state itself.
  test('invader fire and explosions stay quiet on the game over screen', () => {
    tap('Enter')
    for (let n = 0; n < 20000 && count('gameOver') === 0; n++) frame()
    const overAt = sounds.played.length
    for (let n = 0; n < 3000; n++) frame()
    assert.deepEqual(loopSounds(overAt), [])
  })

  test('leaving the page stops the game reacting to keys', () => {
    cleanup()
    cleanup = null
    tap('Enter')
    assert.deepEqual(sounds.played, [])
  })
})

describe('space invaders game loop', () => {
  test('keeps running when a shot is in flight while new invaders are still loading', () => {
    tap('Enter') // the first frame spawns a wave whose images haven't loaded yet
    tap(' ')
    assert.doesNotThrow(runQueuedFrames)
  })

  // Frames with no image loading in between, as when invader.png is slow to arrive.
  function framesWithoutLoading(n) {
    for (let i = 0; i < n; i++) {
      runQueuedFrames()
      mock.timers.tick(16)
    }
  }

  test('keeps running when a wave is still loading at the first invader-fire check', () => {
    tap('Enter')
    assert.doesNotThrow(() => framesWithoutLoading(120))
  })

  test('keeps running when only part of a wave has loaded', () => {
    tap('Enter')
    FakeImage.pending.at(-1).onload() // just the wave's last invader arrives
    assert.doesNotThrow(() => framesWithoutLoading(3000))
  })
})

describe('space invaders pause and restart', () => {
  test('pausing freezes the game until you resume', () => {
    tap('Enter')
    for (let n = 0; n < 700; n++) frame() // invaders are on screen and firing by now
    assert.ok(count('enemyShoot') > 0 && count('gameOver') === 0, 'mid-game when pausing')
    tap('Escape')
    frame() // the frame already queued when Esc was pressed
    const drawnAtPause = drawCount()
    for (let n = 0; n < 5000; n++) frame()
    assert.equal(drawCount(), drawnAtPause, 'nothing moves or is redrawn while paused')
    assert.equal(count('gameOver'), 0, "you can't be killed while paused")

    tap('Escape')
    frame()
    assert.ok(drawCount() > drawnAtPause, 'the game carries on after resuming')
  })

  test("Space while paused doesn't store up shots for when the game resumes", () => {
    tap('Enter')
    for (let n = 0; n < 5; n++) frame() // early on: no shots or explosions on screen yet
    tap('Escape')
    frame()
    for (let n = 0; n < 10; n++) tap(' ')
    tap('Escape')
    delete drawn.arc
    frame()
    assert.equal(drawn.arc ?? 0, 0, 'no shots appear on resume')
  })

  test("pausing and resuming doesn't speed the game up", () => {
    tap('Enter')
    frame()
    for (let n = 0; n < 5; n++) {
      tap('Escape')
      frame()
      tap('Escape')
      frame()
      // a quick double tap, both presses landing between two frames
      tap('Escape')
      tap('Escape')
      frame()
    }
    assert.equal(queuedFrames.length, 1, 'a single game loop')
  })

  test("restarting after a game over doesn't speed the game up", () => {
    tap('Enter')
    for (let n = 0; n < 20000 && count('gameOver') === 0; n++) frame()
    for (let n = 0; n < 200; n++) frame() // the game over menu is up
    const drawnOnMenu = drawCount()
    frame()
    assert.ok(drawCount() > drawnOnMenu, 'the game keeps animating behind the game over menu, as on the live site')

    tap('Enter')
    frame()
    assert.equal(queuedFrames.length, 1, 'a single game loop')
  })
})
