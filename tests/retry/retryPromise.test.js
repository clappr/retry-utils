import { expect } from '@jest/globals'
import retryPromise from '../../lib/j/retryPromise'

describe('Retry Promise Tests', () => {
  test('should reject promise if action parameter is null', () => {
    let invalidAction = retryPromise({ action: null })
    return expect(invalidAction).rejects.toEqual('Action must be defined and a function')
  })

  test('should reject promise if action parameter is empty', () => {
    let invalidAction = retryPromise({})
    return expect(invalidAction).rejects.toEqual('Action must be defined')
  })

  test('should reject promise if action parameter is not a function', () => {
    let invalidAction = retryPromise({ action: Promise.resolve() })
    return expect(invalidAction).rejects.toEqual('Action must be defined and a function')
  })

  test('should reject promise if a non mapped parameter is passed', () => {
    let invalidAction = retryPromise({ nonExistent: 'x', dontKnow: 123 })
    return expect(invalidAction).rejects.toEqual('Action must be defined')
  })

  test('should return rejected promise if all attempts fail', () => {
    let action = jest.fn()
      .mockRejectedValueOnce('Fail')
      .mockRejectedValueOnce('Fail')
      .mockRejectedValue('Definitive Fail')
    
    let retryAction = retryPromise({ action })
    return expect(retryAction).rejects.toEqual('Definitive Fail')
  })

  test('should return resolved promise if resolves immediately', () => {
    let action = jest.fn().mockResolvedValue('Success')
    
    let retryAction = retryPromise({ action })
    return expect(retryAction).resolves.toEqual('Success')
  })

  test('should return resolved promise if resolves in third attempt', () => {
    let action = jest.fn()
    .mockRejectedValueOnce('Fail')
    .mockRejectedValueOnce('Fail')
    .mockRejectedValueOnce('Fail')
    .mockResolvedValue('Success')
    
    let retryAction = retryPromise({ action })
    return expect(retryAction).resolves.toEqual('Success')
  })
})