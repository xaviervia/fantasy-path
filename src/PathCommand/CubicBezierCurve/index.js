import _getContext2dTaskFor from './getContext2dTaskFor'

const CubicBezierCurve = (start, middle, end) => ({
  start,
  middle,
  end,
  toD: () => `C${start.x},${start.y} ${middle.x},${middle.y} ${end.x},${end.y}`,
  getContext2dTaskFor: _getContext2dTaskFor(start, middle, end),
  map: f => CubicBezierCurve(
    {
      x: f(start.x),
      y: f(start.y)
    },
    {
      x: f(middle.x),
      y: f(middle.y)
    },
    {
      x: f(end.x),
      y: f(end.y)
    }
  )
})

export default CubicBezierCurve
