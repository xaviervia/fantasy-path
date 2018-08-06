import React from 'react'
import { render } from 'react-dom'
import Color from 'fantasy-color'
import { add, multiply } from 'ramda'
import { Context2dTask, Path } from '../../dist'

const myPath = Path.fromD(`M100,25
L87.353,25
C82.954,25 78.664,23.4349804 75.583,20.7049463
L69.115,14.9728747
C58.753,5.7917599 41.247,5.7917599 30.885,14.9728747
L24.417,20.7049463
C21.336,23.4349804 17.046,25 12.647,25
L0,25
L0,22.0069626
L12.647,22.0069626
C16.322,22.0069626 19.886,20.7169465 22.424,18.4669183
L28.893,12.7348467
C40.532,2.42171777 59.468,2.42171777 71.107,12.7348467
L77.576,18.4669183
C80.114,20.7169465 83.678,22.0069626 87.353,22.0069626
L100,22.0069626
L100,25
Z`)
.matchWith({
  Ok: ({value}) => value
})

const targetPath = Path.fromD(`M100,25
L94.449,25
C89.285,25 84.291,23.1370186 80.385,19.7530525
L69.298,10.1481485
C58.296,0.618243818 41.704,0.618243818 30.702,10.1481485
L19.615,19.7530525
C15.709,23.1370186 10.715,25 5.551,25
L0,25
L0,21.9930301
L5.551,21.9930301
C9.995,21.9930301 14.292,20.3900461 17.653,17.4780752
L28.74,7.87417126
C40.86,-2.62472375 59.14,-2.62472375 71.26,7.87417126
L82.347,17.4780752
C85.708,20.3900461 90.005,21.9930301 94.449,21.9930301
L100,21.9930301
L100,25
Z`).matchWith({
  Ok: ({value}) => value,
  Error: ({value}) => { throw new Error(value) }
})

console.log(myPath.strictDiffWith(targetPath).matchWith({ Ok: ({value}) => value }))

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
        myPath.concat(targetPath).map(multiply(2)).getContext2dTaskFor
      )
      .map(context2d => {
        context2d.stroke()
        return context2d
      })
      .run()
  }
)
