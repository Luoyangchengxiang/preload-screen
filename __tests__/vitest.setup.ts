/*
 * @Date: 2025-09-30 14:43:54
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-30 14:49:33
 * @FilePath: \preload-screen\__tests__\vitest.setup.ts
 */
import { afterEach, beforeAll, afterAll, vi } from 'vitest'

afterEach(() => {
  let id = setInterval(() => { }, 0) as unknown as number
  while (id > 0) {
    clearInterval(id)
    id--
  }
  vi.clearAllTimers()
  global.document = global.document || { getElementById: () => null }
})

// beforeAll(() => {
//   vi.useFakeTimers()
// })

afterAll(() => {
  vi.useRealTimers()
})
