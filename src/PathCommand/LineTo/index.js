import _getContext2dTaskFor from './getContext2dTaskFor'

const LineTo = (x, y) => ({
  x,
  y,
  commandType: 'LineTo',
  toD: () => `L${x},${y}`,
  getContext2dTaskFor: _getContext2dTaskFor(x, y),
  mapX: f => LineTo(f(x), y),
  mapY: f => LineTo(x, f(y)),
  map: f => LineTo(f(x), f(y)),
  add: otherCommand => otherCommand.match({
    LineTo: (otherX, otherY) => LineTo(x + otherX, y + otherY),
    _: () => LineTo(x, y)
  }),
  toJSON: () => ({
    commandType: 'LineTo',
    x,
    y,
  }),
  match: ({LineTo, _}) => LineTo != null ? LineTo(x, y) : _()
})

LineTo.fromPoint = ({ x, y }) => LineTo(x, y)

export default LineTo
