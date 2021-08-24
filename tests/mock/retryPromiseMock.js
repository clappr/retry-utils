export const retryFailMock = {
  retryError: "Definitive Fail",
  retryHistory: [
    { "attempt_0": "Fail" },
    { "attempt_1": "Fail" },
    { "attempt_2": "Fail" },
    { "attempt_3": "Definitive Fail"}
  ]
}

export const retrySuccessLastAttemptMock = {
  retryResponse: "Success",
  retryHistory: [
    { "attempt_0": "Fail" },
    { "attempt_1": "Fail" },
    { "attempt_2": "Fail" },
  ]
}