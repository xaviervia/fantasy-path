import _getContext2dTaskFor from './getContext2dTaskFor'

const CubicBezierCurve = (start, middle, end) => ({
  start,
  middle,
  end,
  toD: () => `C${start.x},${start.y} ${middle.x},${middle.y} ${end.x},${end.y}`,
  getContext2dTaskFor: _getContext2dTaskFor(start, middle, end)
})

export default CubicBezierCurve
