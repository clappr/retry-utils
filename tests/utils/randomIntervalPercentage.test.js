import { expect } from '@jest/globals'

import randomIntervalPercentage from '../../lib/j/utils/randomIntervalPercentage'

describe('Get Random Int Tests', () => {
  test('should return 1 if percentage parameter is not defined', () => {
    let result = randomIntervalPercentage(null)

    expect(result).toBe(1)
  })

  test('should return 1 if percentage parameter is not a number', () => {
    let resultNaN = randomIntervalPercentage(NaN)
    let resultString = randomIntervalPercentage('')

    expect(resultNaN).toBe(1)
    expect(resultString).toBe(1)
  })

  test('should return correct percentage range for 50%', () => {
    let result = randomIntervalPercentage(0.5)
    let isPercentageRangeCorrect = result >= 0.5 && result <= 1.5

    expect(isPercentageRangeCorrect).toBeTruthy()
  })
})