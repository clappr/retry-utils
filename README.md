# Retry Utils

This lib aims to apply retry patterns for various needed situations.

# Usage

`retryPromise` - Implements retries for a Promise with exponential backoff. The `retryPromise` method apply a fuzz factor of 50% in either direction. So if the ideal delay is `1000ms`, the actual delay will be randomly chosen between `500ms` and `1500ms`. Configuration:

  ```
  retryParameters: {
    action: 'Callback to be executed',
    maxAttempts: 'The maximum number of attempts that should be retried'
    baseDelay: 'The delay before the first retry, in milliseconds',
    backOffFactor: 'The multiplier for successive retry delays'
  }
  ```

`anotherRetryMethod` - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed scelerisque aliquet risus a ultricies.

<br>

# Examples:

`retryPromise`:

```
import { retryPromise } from 'retry-utils'

const getSomething = () => {
  return fetch(`http://httpbin.org/status/500`)
    .then((response) => {
      if (response.ok) return response
      throw new Error(response.statusText)
    })
}

retryPromise(getSomething, 5, 1000, 2)
  .then(() => console.log('Retry success'))
  .catch(() => console.log('Retry error'))

```