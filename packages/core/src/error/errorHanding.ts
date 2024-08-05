import { isPromise } from '..'

export function callWithErrorHandling(fn: (...args: any[]) => any, args?: unknown[]) {
  let res
  try {
    res = args ? fn(...args) : fn()
  }
  catch (err) {
    handleError(err)
  }
  return res
}

export function callWithAsyncErrorHandling(fn: (...args: any[]) => any, args?: unknown[]) {
  const res = callWithErrorHandling(fn, args)
  if (res && isPromise(res)) {
    res.catch((err) => {
      handleError(err)
    })
  }
  return res
}

export function handleError(err: unknown) {
  logError(err)
}

function logError(err: unknown) {
  console.error(err)
}
