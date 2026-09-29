import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(cleanup)

// jsdom has no media engine; individual audio tests override these defaults.
beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValue(
    new DOMException('Interacción necesaria', 'NotAllowedError'),
  )
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
})
