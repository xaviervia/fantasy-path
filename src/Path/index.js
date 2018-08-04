import _toD from './toD'
import _getContext2dTaskFor from './getContext2dTaskFor'

export { default as ClosePath } from './ClosePath'
export { default as CubicBezierCurve } from './CubicBezierCurve'
export { default as LineTo } from './LineTo'
export { default as MoveTo } from './MoveTo'

const Path = (...commands) => ({
  commands,
  toD: () => _toD(commands),
  getContext2dTaskFor: _getContext2dTaskFor(commands),
})

export const toD = _toD
export const getContext2dTaskFor = _getContext2dTaskFor
export default Path
