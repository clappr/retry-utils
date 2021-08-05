import { expect } from '@jest/globals'
import retryPromise from '../../lib/j/retryPromise'

describe('Retry Promise Tests', () => {
  test('should reject promise if action parameter is null', () => {
    let invalidAction = retryPromise(null)
    return expect(invalidAction).rejects.toEqual('Action must be defined')
  })

  test('should reject promise if action parameter is empty', () => {
    let invalidAction = retryPromise('')
    return expect(invalidAction).rejects.toEqual('Action must be defined')
  })

  test('should return rejected promise if all attempts fail', () => {
    let action = jest.fn()
      .mockRejectedValueOnce('Fail')
      .mockRejectedValueOnce('Fail')
      .mockRejectedValue('Definitive Fail')
    
    let retryAction = retryPromise(action)
    return expect(retryAction).rejects.toEqual('Definitive Fail')
  })

  test('should return resolved promise if resolves immediately', () => {
    let action = jest.fn().mockResolvedValue('Success')
    
    let retryAction = retryPromise(action)
    return expect(retryAction).resolves.toEqual('Success')
  })

  test('should return resolved promise if resolves in third attempt', () => {
    let action = jest.fn()
    .mockRejectedValueOnce('Fail')
    .mockRejectedValueOnce('Fail')
    .mockRejectedValueOnce('Fail')
    .mockResolvedValue('Success')
    
    let retryAction = retryPromise(action)
    return expect(retryAction).resolves.toEqual('Success')
  })
})