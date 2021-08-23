import { expect } from '@jest/globals'
import retryPromise from '../../lib/j/retryPromise'

describe('Retry Promise Tests', () => {
  test('should reject promise if action parameter is null', () => {
    let invalidAction = retryPromise({ action: null })
    return expect(invalidAction).rejects.toEqual({ retryError: 'Action must be defined and a function', retryHistory: []})
  })

  test('should reject promise if action parameter is empty', () => {
    let invalidAction = retryPromise({})
    return expect(invalidAction).rejects.toEqual({ retryError: 'Action must be defined and a function', retryHistory: []})
  })

  test('should reject promise if action parameter is not a function', () => {
    let invalidAction = retryPromise({ action: Promise.resolve() })
    return expect(invalidAction).rejects.toEqual({ retryError: 'Action must be defined and a function', retryHistory: []})
  })

  test('should reject promise if a non mapped parameter is passed', () => {
    let invalidAction = retryPromise({ nonExistent: 'x', dontKnow: 123 })
    return expect(invalidAction).rejects.toEqual({ retryError: 'Action must be defined and a function', retryHistory: []})
  })

  test('should return rejected promise if all attempts fail', () => {
    let action = jest.fn()
      .mockRejectedValueOnce({ error: 'Fail' })
      .mockRejectedValueOnce({ error: 'Fail' })
      .mockRejectedValue({ error: 'Fail' })
    
    let retryAction = retryPromise({ action })
    return expect(retryAction).rejects.toBeDefined()
  })

  test('should return resolved promise if resolves immediately', () => {
    let action = jest.fn().mockResolvedValue('Success')
    
    let retryAction = retryPromise({ action })
    return expect(retryAction).resolves.toBeDefined()
  })

  test('should return resolved promise if resolves in third attempt', () => {
    let action = jest.fn()
    .mockRejectedValueOnce('Fail')
    .mockRejectedValueOnce('Fail')
    .mockRejectedValueOnce('Fail')
    .mockResolvedValue('Success')
    
    let retryAction = retryPromise({ action })
    return expect(retryAction).resolves.toBeDefined()
  })

  test('should return resolved promise if specified status code should be retryable', () => {
    let action = jest.fn()
      .mockRejectedValueOnce({ statusCode: 400 })
      .mockResolvedValue('Success')

    let retryAction = retryPromise({ action, retryableErrors: [400] })

    return expect(retryAction).resolves.toBeDefined()
  })

  test('should return rejected promise if specified status code should not be retryable', () => {
    let mockFn = jest.fn().mockRejectedValueOnce({ statusCode: 400 })
    let retryParameters = {
      action: mockFn,
      retryableErrors: [500, 501]
    }

    let retryAction = retryPromise(retryParameters)

    return expect(retryAction).rejects.toBeDefined()
  })
})