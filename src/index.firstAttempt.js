import React from 'react'
import { render } from 'react-dom'
import Color from 'fantasy-color'
import { add } from 'ramda'
import Path, { CubicBezierCurve, LineTo, MoveTo } from './Path'
import Point from './Point'

const myPath = Path(
  //
  MoveTo(0, 80),
  LineTo(20, 60),
  CubicBezierCurve([20, 60], [60, 20], [100, 60]),
  LineTo(120, 80)
)

const topLeftPoint = Point(0, 0)
const topRightPoint = Point(120, 0)
const bottomLeftPoint = Point(0, 120)
const bottomRightPoint = Point(120, 120)

const middleLeft = Point(0, 60)
const middleTop = Point(60, 0)
const middleRight = Point(120, 60)
const middleBottom = Point(60, 120)
const center = Point(60, 60)

const topLeftCorner = Path(
  MoveTo.fromPoint(middleLeft),
  LineTo.fromPoint(topLeftPoint.mapY(add(10))),
  CubicBezierCurve(topLeftPoint.mapY(add(10)), topLeftPoint, topLeftPoint.mapX(add(10))),
  LineTo.fromPoint(middleTop)
)

const leftTopThroughCenter = Path(
  MoveTo.fromPoint(middleLeft),
  LineTo.fromPoint(center.mapX(add(-10))),
  CubicBezierCurve(center.mapX(add(-10)), center, center.mapY(add(-10))),
  LineTo.fromPoint(middleTop)
)

const rightTopThroughCenter = Path(
  MoveTo.fromPoint(middleRight),
  LineTo.fromPoint(center.mapX(add(10))),
  CubicBezierCurve(center.mapX(add(10)), center, center.mapY(add(-10))),
  LineTo.fromPoint(middleTop)
)

console.log(leftTopThroughCenter)

// const topRightCorner = Path(
//   MoveTo(60, 0),
//   LineTo(110, 0),
//   CubicBezierCurve(
//     [110, 0],
//     [120, 120],
//     [10, 0]
//   ),
//   LineTo(60, 0)
// )

const palette = {
  black: Color.of(0, 0, 0, 1),
  transparent: Color.of(0, 0, 0, 0),
}

render(
  <main
    style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <svg
      style={{
        width: 140,
        height: 140,
      }}
    >
      <g
        style={{
          transform: 'translate(10px, 10px)',
        }}
      >
        <path
          d={topLeftCorner.toD()}
          stroke={palette.black.toString()}
          fill={palette.transparent.toString()}
        />
        <path
          d={leftTopThroughCenter.toD()}
          stroke={palette.black.toString()}
          fill={palette.transparent.toString()}
        />
        <path
          d={rightTopThroughCenter.toD()}
          stroke={palette.black.toString()}
          fill={palette.transparent.toString()}
        />
      </g>
    </svg>
  </main>,
  document.getElementById('root')
)
