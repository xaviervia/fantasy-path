const LineTo = (x, y) => ({
  x,
  y,
  commandType: 'LineTo',
  toD: () => `L${x},${y}`,
})

LineTo.fromPoint = ({ x, y }) => LineTo(x, y)

export default LineTo
