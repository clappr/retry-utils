import { expect } from '@jest/globals'
import retryPromise from '../../lib/j/retryPromise'
import {
  retrySuccessLastAttemptMock,
  retryFailMock,
  retryFailEmptyData,
  retryFailCodeNotRetryable
} from '../mock/retryPromiseMock'

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
      .mockRejectedValueOnce('Fail')
      .mockRejectedValueOnce('Fail')
      .mockRejectedValueOnce('Fail')
      .mockRejectedValue('Definitive Fail')
    
    return retryPromise({ action })
      .catch((error) => {
        expect(error.retryError).toEqual(retryFailMock.retryError)
      })
  })

  test('should return resolved promise if resolves immediately', () => {
    let action = jest.fn().mockResolvedValue({ data: 'Success' })
    
    return retryPromise({ action })
      .then((response) => {
        expect(response.retryResponse).toMatchObject(retrySuccessLastAttemptMock.retryResponse)
      })
  })

  test('should return resolved promise if resolves in third attempt', () => {
    let action = jest.fn()
    .mockRejectedValueOnce('Fail')
    .mockRejectedValueOnce('Fail')
    .mockRejectedValueOnce('Fail')
    .mockResolvedValue({ data: 'Success' })
    
    return retryPromise({ action })
      .then((response) => {
        expect(response.retryResponse).toMatchObject(retrySuccessLastAttemptMock.retryResponse)
      })
  })

  test('should return resolved promise if specified status code should be retryable', () => {
    let action = jest.fn()
      .mockRejectedValueOnce({ statusCode: 400 })
      .mockResolvedValue({ data: 'Success' })

    return retryPromise({ action, retryableErrors: [400] })
      .then((response) => {
        expect(response.retryResponse).toMatchObject(retrySuccessLastAttemptMock.retryResponse)
      })
  })

  test('should return reject promise if status code is not specified', () => {
    let action = jest.fn().mockRejectedValue('Fail')

    return retryPromise({ action, retryableErrors: [400] })
      .catch((error) => {
        expect(error).toMatchObject(retryFailEmptyData)
      })
  })

  test('should return rejected promise if specified status code should not be retryable', () => {
    let mockFn = jest.fn().mockRejectedValueOnce({ statusCode: 400 })
    let retryParameters = {
      action: mockFn,
      retryableErrors: [500, 501]
    }

    return retryPromise(retryParameters)
      .catch((error) => {
        expect(error).toMatchObject(retryFailCodeNotRetryable)
      })
  })
})