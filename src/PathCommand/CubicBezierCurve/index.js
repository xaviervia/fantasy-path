import _getContext2dTaskFor from './getContext2dTaskFor'

const CubicBezierCurve = (start, middle, end) => ({
  commandType: 'CubicBezierCurve',
  start,
  middle,
  end,
  toD: () => `C${start.x},${start.y} ${middle.x},${middle.y} ${end.x},${end.y}`,
  getContext2dTaskFor: _getContext2dTaskFor(start, middle, end),
  mapX: f => CubicBezierCurve(start.mapX(f), middle.mapX(f), end.mapX(f)),
  mapY: f => CubicBezierCurve(start.mapY(f), middle.mapY(f), end.mapY(f)),
  map: f => CubicBezierCurve(start.map(f), middle.map(f), end.map(f)),
  add: otherCommand => otherCommand.match({
    CubicBezierCurve: (otherStart, otherMiddle, otherEnd) => CubicBezierCurve(
      start.add(otherStart),
      middle.add(otherMiddle),
      end.add(otherEnd),
    ),
    _: () => CubicBezierCurve(start, middle, end)
  }),
  toJSON: () => ({
    commandType: 'CubicBezierCurve',
    start: start.toJSON(),
    middle: middle.toJSON(),
    end: end.toJSON(),
  }),
  match: ({CubicBezierCurve, _}) => CubicBezierCurve != null ? CubicBezierCurve(start, middle, end) : _()
})

export default CubicBezierCurve
