const Point = (x, y) => ({
  x,
  y,
  mapX: f => Point(f(x), y),
  mapY: f => Point(x, f(y)),
  map: f => Point(f(x), f(y)),
  toD: () => `${x},${y}`,
  toJSON: () => ({x, y}),
  add: otherPoint => Point(x + otherPoint.x, y + otherPoint.y),
})

export default Point
