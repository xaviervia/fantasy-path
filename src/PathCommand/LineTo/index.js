import _getContext2dTaskFor from './getContext2dTaskFor'

const LineTo = (x, y) => ({
  x,
  y,
  commandType: 'LineTo',
  toD: () => `L${x},${y}`,
  getContext2dTaskFor: _getContext2dTaskFor(x, y),
  map: f => LineTo(
    f(x),
    f(y)
  )
})

LineTo.fromPoint = ({ x, y }) => LineTo(x, y)

export default LineTo
