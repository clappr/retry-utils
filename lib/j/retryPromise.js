import randomIntervalPercentage from './utils/randomIntervalPercentage'

/**
 * 
 * @param {Function} action Callback to be executed
 * @param {number} maxAttempts The maximum number of attempts that should be retried
 * @param {milliseconds} baseDelay The delay before the first retry, in milliseconds
 * @param {number} backOffFactor The multiplier for successive retry delays
 * 
 * @returns a resolved Promise if retry succeed and rejected if it doesn't
 */
const retryPromise = ({ action, maxAttempts = 3, baseDelay = 100, backOffFactor = 2 }) => {
  let numberOfAttempts = 0
  
  const retryAttempt = () => {
    if (!action) return Promise.reject('Action must be defined')

    return action()
      .then(function (response) {
        console.log(`Retry success:\n${response}`)
        return response
      })
      .catch(function (error) {
        if (numberOfAttempts === maxAttempts) {
          console.log(`Retry error:\n${error}`)
          return Promise.reject(error)
        }

        // Initiate new attempt
        numberOfAttempts++

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

export default retryPromise