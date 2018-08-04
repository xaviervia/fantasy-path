const CubicBezierCurve = (start, middle, end) => ({
  start,
  middle,
  end,
  toD: () => `C${start.x},${start.y} ${middle.x},${middle.y} ${end.x},${end.y}`,
})

export default CubicBezierCurve
