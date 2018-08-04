# fantasy-path

Fantasy Land types for operating with vector paths, compatible with SVG and Canvas.

*Work in progress*

## Types

- `Context2dTask`: Task for drawing to a context2d
  - `fromContext2d(context2d)`
- `Point(x, y)`:
  - `mapX(f)`
  - `mapY(f)`
  - `toD() -> String`
- `PathCommand`:
  - Constructors
    - `MoveTo(x, y)`
    - `LineTo(x, y)`
    - `CubicBezierCurve(point1, point2, point3)`
    - `ClosePath()`
  - Methods
    - `mapX(f)`
    - `mapY(f)`
    - `map(f)`
    - `toD() -> String`
    - `getContext2dTaskFor(context2d) -> Context2dTask`
- `Path(...commands)`
  - `map(f)`
  - `toD() -> String`
  - `getContext2dTaskFor(context2d) -> Context2dTask`
  - `mapX(f)`
  - `mapY(f)`
  - `concat(otherPath)`
  - `.empty() -> Path`
