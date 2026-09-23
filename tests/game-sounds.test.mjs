import { describe, test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

import { createSounds } from '../scripts/game/sounds.js'

// Stands in for the browser's HTMLAudioElement. `blocked` mimics the autoplay policy
// rejecting play() before the visitor has interacted with the page.
class FakeAudio {
  static blocked = false
  constructor(src) {
    this.src = src
    this.loop = false
    this.muted = false
    this.paused = true
    this.currentTime = 0
    this.plays = 0
  }
  play() {
    this.plays++
    if (FakeAudio.blocked) return Promise.reject(new DOMException('blocked', 'NotAllowedError'))
    this.paused = false
    return Promise.resolve()
  }
  pause() {
    this.paused = true
  }
}

// Stands in for window, and counts the listeners still attached to it.
class Page extends EventTarget {
  #listeners = new Map()
  addEventListener(type, fn, options) {
    if (!this.#listeners.has(type)) this.#listeners.set(type, new Set())
    this.#listeners.get(type).add(fn)
    super.addEventListener(type, fn, options)
  }
  removeEventListener(type, fn, options) {
    this.#listeners.get(type)?.delete(fn)
    super.removeEventListener(type, fn, options)
  }
  get listenerCount() {
    let count = 0
    for (const fns of this.#listeners.values()) count += fns.size
    return count
  }
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0))

let page
function setup() {
  const sounds = createSounds({
    music: 'music.wav',
    effects: { shoot: 'shoot.wav', explode: 'explode.wav' },
    Audio: FakeAudio,
    target: page,
  })
  // Reach the elements the module created, by source.
  return { sounds, audio: (src) => sounds.elements.find((el) => el.src === src) }
}

beforeEach(() => {
  FakeAudio.blocked = false
  page = new Page()
})

describe('game sounds', () => {
  test('starts the background music on a loop', () => {
    const { sounds, audio } = setup()
    sounds.startMusic()
    assert.equal(audio('music.wav').loop, true)
    assert.equal(audio('music.wav').paused, false)
  })

  test('starts the music on the first key press when autoplay is blocked', async () => {
    const { sounds, audio } = setup()
    FakeAudio.blocked = true
    sounds.startMusic()
    await settle()
    assert.equal(audio('music.wav').paused, true)

    FakeAudio.blocked = false
    page.dispatchEvent(new Event('keydown'))
    assert.equal(audio('music.wav').paused, false)

    page.dispatchEvent(new Event('keydown'))
    assert.equal(audio('music.wav').plays, 2, 'only retries once')
    assert.equal(page.listenerCount, 0)
  })

  test('also starts blocked music on a click or tap', async () => {
    const { sounds, audio } = setup()
    FakeAudio.blocked = true
    sounds.startMusic()
    await settle()
    FakeAudio.blocked = false
    page.dispatchEvent(new Event('pointerdown'))
    assert.equal(audio('music.wav').paused, false)
  })

  test('restarts an effect from the beginning each time it plays', () => {
    const { sounds, audio } = setup()
    sounds.play('shoot')
    audio('shoot.wav').currentTime = 0.15
    sounds.play('shoot')
    assert.equal(audio('shoot.wav').currentTime, 0)
    assert.equal(audio('shoot.wav').plays, 2)
  })

  test('ignores sounds it does not know', () => {
    const { sounds } = setup()
    assert.doesNotThrow(() => sounds.play('bonus'))
  })

  test('swallows blocked effect playback instead of raising errors', async () => {
    const { sounds } = setup()
    FakeAudio.blocked = true
    sounds.play('explode')
    await settle() // an unhandled rejection here would fail the test run
  })

  test('mute silences the music and stops effects playing', () => {
    const { sounds, audio } = setup()
    sounds.startMusic()
    assert.equal(sounds.toggleMute(), true)
    assert.equal(audio('music.wav').muted, true)
    sounds.play('shoot')
    assert.equal(audio('shoot.wav').plays, 0)

    assert.equal(sounds.toggleMute(), false)
    assert.equal(audio('music.wav').muted, false)
  })

  test('does not start blocked music on a key press made while muted', async () => {
    const { sounds, audio } = setup()
    FakeAudio.blocked = true
    sounds.startMusic()
    await settle()
    FakeAudio.blocked = false
    sounds.toggleMute()
    page.dispatchEvent(new Event('keydown'))
    assert.equal(audio('music.wav').paused, true)
  })

  test('unmuting starts music that never got going', async () => {
    const { sounds, audio } = setup()
    FakeAudio.blocked = true
    sounds.startMusic()
    await settle()
    FakeAudio.blocked = false
    sounds.toggleMute()
    page.dispatchEvent(new Event('keydown'))
    sounds.toggleMute()
    assert.equal(audio('music.wav').paused, false)
  })

  test('destroy stops the music and cancels a pending autoplay retry', async () => {
    const { sounds, audio } = setup()
    FakeAudio.blocked = true
    sounds.startMusic()
    await settle()
    FakeAudio.blocked = false
    sounds.destroy()
    assert.equal(page.listenerCount, 0, 'leaves no listeners on the page')
    page.dispatchEvent(new Event('keydown'))
    assert.equal(audio('music.wav').paused, true)
    sounds.play('shoot')
    assert.equal(audio('shoot.wav').plays, 0)
  })

  test('destroy pauses music that is playing', () => {
    const { sounds, audio } = setup()
    sounds.startMusic()
    sounds.destroy()
    assert.equal(audio('music.wav').paused, true)
  })
})
