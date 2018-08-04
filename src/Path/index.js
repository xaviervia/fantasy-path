import _toD from './toD'

export { default as ClosePath } from './ClosePath'
export { default as CubicBezierCurve } from './CubicBezierCurve'
export { default as LineTo } from './LineTo'
export { default as MoveTo } from './MoveTo'

const Path = (...commands) => ({
  commands,
  toD: () => _toD(commands),
})

export const toD = _toD
export default Path
