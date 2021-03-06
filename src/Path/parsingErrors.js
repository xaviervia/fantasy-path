export const unexpectedCommaInLineToX = ({position}) =>
  `Comma found when expecting a number in a LineTo (L) command at character ${position}, please ensure the L is followed by a float indicating the value for the X coordinate.`

export const unexpectedCommaInMoveToX = ({position}) =>
  `Comma found when expecting a number in a MoveTo (M) command at character ${position}, please ensure the M is followed by a float indicating the value for the X coordinate.`

export const unexpectedCommaInCubicBezierCurveStartX = ({position}) =>
  `Comma found when expecting a number in a CubicBezierCurve (C) command at character ${position}, please ensure the C is followed by three sets of points separated by spaces, each consisting of two float or integer numbers representing X and Y coordinates, separated by a comma.`

export const unexpectedCharacterInLineToMiddle = parsingContext =>
  `Unexpected character '${parsingContext.getCharacter()}' in position ${parsingContext.getPosition()}, after the X coordinate value of a LineTo there should be a comma, and optionally spaces.`

export const unexpectedCharacterInMoveToMiddle = parsingContext =>
  `Unexpected character '${parsingContext.getCharacter()}' in position ${parsingContext.getPosition()}, after the X coordinate value of a MoveTo there should be a comma, and optionally spaces.`

export const unexpectedCharacterInCubicBezierStartMiddle = parsingContext =>
  `Unexpected character '${parsingContext.getCharacter()}' in position ${parsingContext.getPosition()}, after the X coordinate value of a CubicBezierCurve there should be a comma, and optionally spaces.`

export const unexpectedCharacterInMoveToY = parsingContext =>
  parsingContext.getCharacter() === undefined
    ? `Unexpected end of text when expecting a number in a MoveTo (M) command at position ${parsingContext.position}, please ensure there is a Y value after the comma.`
    : `Character ${parsingContext.getCharacter()} found when expecting a number in a MoveTo (M) command at position ${parsingContext.position}, please ensure there is a Y value after the comma.`

export const unexpectedCharacterInLineToY = parsingContext =>
  parsingContext.getCharacter() === undefined
    ? `Unexpected end of text when expecting a number in a LineTo (L) command at position ${parsingContext.position}, please ensure there is a Y value after the comma.`
    : `Character ${parsingContext.getCharacter()} found when expecting a number in a LineTo (L) command at position ${parsingContext.position}, please ensure there is a Y value after the comma.`

export const unexpectedCharacterInCubicBezierStartY = parsingContext =>
  parsingContext.getCharacter() === undefined
    ? `Unexpected end of text when expecting a number in a CubicBezierCurve (C) command at position ${parsingContext.position}, please ensure there is a Y value after the comma.`
    : `Character ${parsingContext.getCharacter()} found when expecting a number in a CubicBezierCurve (C) command at position ${parsingContext.position}, please ensure there is a Y value after the comma.`

export const unterminatedMoveTo = parsingContext =>
  `Unterminated MoveTo (M) command at character ${parsingContext.position}, please ensure the M is followed by two float or integer numbers representing X and Y coordinates, separated by a comma.`

export const unterminatedLineTo = parsingContext =>
  `Unterminated LineTo (L) command at character ${parsingContext.position}, please ensure the L is followed by two float or integer numbers representing X and Y coordinates, separated by a comma.`

export const unterminatedCubicBezierCurve = parsingContext => {
  switch (parsingContext.getBuffer().length) {
    case 0:
      return `Unterminated CubicBezierCurve (C) command at character ${parsingContext.position}, please ensure the C is followed by three sets of points separated by spaces, each consisting of two float or integer numbers representing X and Y coordinates, separated by a comma.`
    case 1:
      return `Unexpected end of text when expecting a number in a CubicBezierCurve (C) command at position ${parsingContext.getPosition()}. Only one set of X and Y values found, there should be three.`
    case 2:
      return `Unexpected end of text when expecting a number in a CubicBezierCurve (C) command at position ${parsingContext.getPosition()}. Only two set of X and Y values found, there should be three.`
  }
}
