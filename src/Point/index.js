const Point = (x, y) => ({
  x,
  y,
  mapX: (f) => Point(f(x), y),
  mapY: (f) => Point(x, f(y)),
  toD: () => `${x},${y}`,
})

export default Point
