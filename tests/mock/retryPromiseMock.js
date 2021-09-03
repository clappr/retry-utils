/** Success Mock */

const retrySuccessLastAttemptMock = {
  retryResponse: { data: "Success" },
  retryHistory: [
    { "attempt_0": "Fail" },
    { "attempt_1": "Fail" },
    { "attempt_2": "Fail" },
  ]
}

/** Fail Mock */

const retryFailMock = {
  retryError: "Definitive Fail",
  retryHistory: [
    { "attempt_0": "Fail" },
    { "attempt_1": "Fail" },
    { "attempt_2": "Fail" },
    { "attempt_3": "Definitive Fail"}
  ]
}

const retryFailEmptyData = {
  retryError: {},
  retryHistory: []
}

const retryFailCodeNotRetryable = {
  retryError: {
    statusCode: 400
  },
  retryHistory: []
}

/** Exports */

export {
  retrySuccessLastAttemptMock,
  retryFailMock,
  retryFailEmptyData,
  retryFailCodeNotRetryable,
}