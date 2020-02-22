import { reverse } from '../BuiltIns/arrays.js'

export const compose = (...fns) =>
  fns.reduce((fn, memoFn) => (...args) => fn(memoFn(...args)))

export const partial = (fn, ...argsToApply) => {
  return (...restArgsToApply) => {
    return fn(...argsToApply, ...restArgsToApply)
  }
}

export const negate = (fn) => (...args) => !fn(...args)
export const multiplex = (...fns) => (...args) =>
  reverse(fns).map((fn) => fn(...args))

export const doThenBind = (fn, binderFn) => (args) => {
  fn(args) // eslint-disable-line functional/no-expression-statement
  return binderFn(fn)
}
