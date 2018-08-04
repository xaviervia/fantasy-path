const MoveTo = (x, y) => ({
  x,
  y,
  commandType: 'MoveTo',
  toD: () => `M${x},${y}`,
})

MoveTo.fromPoint = ({ x, y }) => MoveTo(x, y)

export default MoveTo
