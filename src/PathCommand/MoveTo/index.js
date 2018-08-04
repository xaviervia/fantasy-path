import _getContext2dTaskFor from './getContext2dTaskFor'

const MoveTo = (x, y) => ({
  x,
  y,
  commandType: 'MoveTo',
  toD: () => `M${x},${y}`,
  getContext2dTaskFor: _getContext2dTaskFor(x, y),
  map: f => MoveTo(f(x), f(y))
})

MoveTo.fromPoint = ({ x, y }) => MoveTo(x, y)

export default MoveTo
