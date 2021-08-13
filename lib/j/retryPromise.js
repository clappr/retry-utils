import randomIntervalPercentage from './utils/randomIntervalPercentage'

/**
 * 
 * @param {Function} action Callback to be executed
 * @param {number} maxAttempts The maximum number of attempts that should be retried
 * @param {milliseconds} baseDelay The delay before the first retry, in milliseconds
 * @param {number} backOffFactor The multiplier for successive retry delays
 * @param {array} retryableErrors Specify a list of status code that should be retryable
 * 
 * @returns a resolved Promise if retry succeed and rejected if it doesn't
 */
const retryPromise = ({ action, maxAttempts = 3, baseDelay = 100, backOffFactor = 2, retryableErrors = null }) => {
  let numberOfAttempts = 0
  let retryHistory = new Map()
  
  const retryAttempt = () => {
    if (!action || typeof action !== 'function') return Promise.reject('Action must be defined and a function')

    return action()
      .then(function (resource) {
        retryHistory.set(`attempt_${numberOfAttempts}`, resource)
        return { resource, retryHistory }
      })
      .catch(function (error) {
        if (retryableErrors && !isErrorRetryable(retryableErrors, error.statusCode)) return Promise.reject({ error })

        if (numberOfAttempts === maxAttempts) return Promise.reject({ error, retryHistory })

        // Initiate new attempt
        numberOfAttempts++

        retryHistory.set(`attempt_${numberOfAttempts}`, error)

        let baseDelayBackOff = Math.pow(backOffFactor, numberOfAttempts - 1) * baseDelay // backOffFactor^(nAttempt - 1) * baseDelay
        let fuzzedDelay = baseDelayBackOff * randomIntervalPercentage(0.5)

        return new Promise((resolve) => {
          setTimeout(function () {
            console.log(`Retrying...\nIf the retries fail we delay the next attempt in ${baseDelayBackOff / 1000} seconds\n Fuzz factor for retry: ${fuzzedDelay}`)
            resolve(retryAttempt())
          }, fuzzedDelay)  /* Fuzz the delay in 50 % to avoid tons of clients hitting the server at once */
        })
      })
  }

  return retryAttempt()
}

const isErrorRetryable = (retryableErrors, currentError = '') => {
  return retryableErrors.includes(currentError)
}

export default retryPromise