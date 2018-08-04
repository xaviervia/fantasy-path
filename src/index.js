import React from 'react'
import { render } from 'react-dom'
import Color from 'fantasy-color'
import { add, multiply } from 'ramda'
import Path from './Path'
import { ClosePath, CubicBezierCurve, LineTo, MoveTo } from './PathCommand'
import Point from './Point'
import Context2dTask from './Context2dTask'

const myPath = Path(
  MoveTo(0, 80),
  LineTo(20, 60),
  CubicBezierCurve(Point(20, 60), Point(60, 20), Point(100, 60)),
  LineTo(120, 80),
  ClosePath()
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
    <canvas id="theCanvas" style={{ width: 140, height: 140 }} />
  </main>,
  document.getElementById('root'),
  () => {
    const canvasElement = global.theCanvas

    canvasElement.setAttribute('width', 280)
    canvasElement.setAttribute('height', 280)
    const context2d = canvasElement.getContext('2d')

    Context2dTask.fromContext2d(context2d)
      .beginPath()
      .chain(
        leftTopThroughCenter
          .map(multiply(2))
          .getContext2dTaskFor
      )
      .chain(
        rightTopThroughCenter
          .map(multiply(2))
          .getContext2dTaskFor
      )
      .chain(
        myPath
          .map(multiply(2))
          .getContext2dTaskFor
      )
      .map(context2d => {
        context2d.stroke()
        return context2d
      })
      .run()
  }
)
