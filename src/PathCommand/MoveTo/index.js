import _getContext2dTaskFor from './getContext2dTaskFor'

const MoveTo = (x, y) => ({
  x,
  y,
  commandType: 'MoveTo',
  toD: () => `M${x},${y}`,
  getContext2dTaskFor: _getContext2dTaskFor(x, y),
  mapX: f => MoveTo(f(x), y),
  mapY: f => MoveTo(x, f(y)),
  map: f => MoveTo(f(x), f(y)),
  add: otherCommand => otherCommand.match({
    MoveTo: (otherX, otherY) => MoveTo(x + otherX, y + otherY),
    _: () => MoveTo(x, y)
  }),
  toJSON: () => ({
    x,
    y,
    commandType: 'MoveTo',
  }),
  match: ({MoveTo, _}) => MoveTo != null ? MoveTo(x, y) : _()
})

MoveTo.fromPoint = ({ x, y }) => MoveTo(x, y)

export default MoveTo
