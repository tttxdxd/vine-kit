import { isPromise } from ".."

export function callWithErrorHandling(fn: Function, args?: unknown[]) {
  let res
  try {
    res = args ? fn(...args) : fn()
  } catch (err) {
    handleError(err)
  }
  return res
}

export function callWithAsyncErrorHandling(fn: Function, args?: unknown[]) {
  const res = callWithErrorHandling(fn, args)
  if (res && isPromise(res)) {
    res.catch(err => {
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
