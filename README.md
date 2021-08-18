# Retry Utils

[![npm version](https://badge.fury.io/js/retry-utils.svg)](https://badge.fury.io/js/retry-utils)

This lib aims to apply retry patterns for various needed situations. The definitions were inspired by the [retry implementation of Shaka Player](https://github.com/google/shaka-player/blob/df5340fa2b708245f1737f6928f4452425d5341a/docs/tutorials/network-and-buffering-config.md).


```
$ npm i retry-utils
```

# Usage

`retryPromise` - Implements retries for a callback function with exponential backoff, returning a **resolved** promise if successeded and a **rejected** promise if doesn't.

Configuration:

```
retryParameters: {
  action: 'Callback to be executed', (*)
  maxAttempts: 'The maximum number of attempts that should be retried'
  baseDelay: 'The delay before the first retry, in milliseconds',
  backOffFactor: 'The multiplier for successive retry delays'
  retryableErrors: 'A array specifying which HTTP status should be at retry flow'
}
```

(*) Mandatory fields.

The `retryPromise` method apply a fuzz factor of 50% in either direction. So if the ideal delay is `1000ms`, the actual delay will be randomly chosen between `500ms` and `1500ms`. 

<br>

### The returned promise should have the follow content:

`When resolved`: A object with the resource and the retry history flow, like:

```
{
  resource: 'Hey! I as successfull in the third attempt!'
  retryHistory: [
    attempt_1 : { error: 'Failed at first' },
    attempt_2 : { error: 'Failed at second' },
    attempt_3 : { resource: 'Hey! I as successfull in the third attempt!' }
  ]
}
```

`When rejected`: A object with the error and the retry history flow, like:
```
{
  error: 'Failed at my last attempt, sorry :('
  retryHistory: [
    attempt_1 : { error: 'Failed at first' },
    attempt_2 : { error: 'Failed at second' },
    attempt_3 : { error: 'Failed at my last attempt, sorry :(' }
  ]
}
```

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

let retryParameters: {
  action: getSomething,
  maxAttempts: 5,
  baseDelay: 1000,
  backOffFactor: 3,
  retryableErrors: [500, 501, 502]
}

retryPromise(retryParameters)
  .then(() => console.log('Retry success'))
  .catch(() => console.log('Retry error'))
```
