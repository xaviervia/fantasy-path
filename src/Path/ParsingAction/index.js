const createAction = name => () => ({
  inspect: () => `ParsingAction.${name}()`,
  match: (matchers) =>
    matchers[name] != null
      ? matchers[name]()
      : matchers._()
})

export const Initial = createAction('Initial')

export const ClosePath = createAction('ClosePath')

export const CubicBezierCurve = createAction('CubicBezierCurve')

export const CubicBezierCurveStart = createAction('CubicBezierCurveStart')

export const CubicBezierCurveStartX = createAction('CubicBezierCurveStartX')

export const CubicBezierCurveStartMiddle = createAction('CubicBezierCurveStartMiddle')

export const CubicBezierCurveStartY = createAction('CubicBezierCurveStartY')

export const LineTo = createAction('LineTo')

export const LineToX = createAction('LineToX')

export const LineToMiddle = createAction('LineToMiddle')

export const LineToY = createAction('LineToY')

export const MoveTo = createAction('MoveTo')

export const MoveToX = createAction('MoveToX')

export const MoveToMiddle = createAction('MoveToMiddle')

export const MoveToY = createAction('MoveToY')

export const Problem = createAction('Problem')
