import Maybe from 'folktale/maybe'
import Result from 'folktale/result'
import { ClosePath, CubicBezierCurve, LineTo, MoveTo } from '../PathCommand'
import Point from '../Point'
import * as ParsingAction from './ParsingAction'
import ParsingContext from './ParsingContext'
import * as parsingErrors from './parsingErrors'
// import { magenta } from 'chalk'

const parseNext = parsingContext => {
  // console.log(`${magenta('<>')} ${parsingContext.getAction().inspect()}`, parsingContext.getBuffer())

  return parsingContext
    .getAction()
    .match({
      Initial: () => initialState(parsingContext),

      ClosePath: () => generateCommandStartState(
        ClosePath,
        null,
        null,
        0
      )(parsingContext),

      CubicBezierCurve: () => generateCommandStartState(
        CubicBezierCurve,
        ParsingAction.CubicBezierCurveStart,
        parsingErrors.unterminatedCubicBezierCurve,
        3
      )(parsingContext),

      CubicBezierCurveStart: () => generateCommandStartState(
        Point,
        ParsingAction.CubicBezierCurveStartX,
        () => 'It shouldn’t have gotten here (CubicBezierCurveStart)',
        2
      )(parsingContext),

      CubicBezierCurveStartX: () => generateCollectNumberState(
        ParsingAction.CubicBezierCurveStartMiddle,
        parsingErrors.unexpectedCommaInCubicBezierCurveStartX
      )(parsingContext),

      CubicBezierCurveStartMiddle: () => generateCollectCommaState(
        ParsingAction.CubicBezierCurveStartY,
        parsingErrors.unexpectedCharacterInCubicBezierStartMiddle
      )(parsingContext),

      CubicBezierCurveStartY: () => generateCollectNumberState(
        null,
        parsingErrors.unexpectedCharacterInCubicBezierStartY,
      )(parsingContext),

      LineTo: () => generateCommandStartState(
        LineTo,
        ParsingAction.LineToX,
        parsingErrors.unterminatedLineTo,
        2
      )(parsingContext),

      LineToX: () => generateCollectNumberState(
        ParsingAction.LineToMiddle,
        parsingErrors.unexpectedCommaInLineToX
      )(parsingContext),

      LineToMiddle: () => generateCollectCommaState(
        ParsingAction.LineToY,
        parsingErrors.unexpectedCharacterInLineToMiddle
      )(parsingContext),

      LineToY: () => generateCollectNumberState(
        null,
        parsingErrors.unexpectedCharacterInLineToY
      )(parsingContext),

      MoveTo: () => generateCommandStartState(
        MoveTo,
        ParsingAction.MoveToX,
        parsingErrors.unterminatedMoveTo,
        2
      )(parsingContext),

      MoveToX: () => generateCollectNumberState(
        ParsingAction.MoveToMiddle,
        parsingErrors.unexpectedCommaInMoveToX
      )(parsingContext),

      MoveToMiddle: () => generateCollectCommaState(
        ParsingAction.MoveToY,
        parsingErrors.unexpectedCharacterInMoveToMiddle
      )(parsingContext),

      MoveToY: () => generateCollectNumberState(
        null,
        parsingErrors.unexpectedCharacterInMoveToY
      )(parsingContext),

      Problem: () => parsingContext,

      _: () => { throw new Error('You forgot to add a pattern for this') },
    })
}

const initialState = parsingContext => {
  switch (parsingContext.getCharacter()) {
    case 'M':
      return parseNext(
        parsingContext
          .consumeCharacter()
          .addAction(ParsingAction.MoveTo())
      )

    case 'L':
      return parseNext(
          parsingContext
            .consumeCharacter()
            .addAction(ParsingAction.LineTo())
      )

    case 'C':
      return parseNext(
        parsingContext
          .consumeCharacter()
          .addAction(ParsingAction.CubicBezierCurve())
      )

    case 'Z':
      return parseNext(
        parsingContext
          .consumeCharacter()
          .addAction(ParsingAction.ClosePath())
      )

    case ' ':
    case '\n':
    case '\r':
    case '\t':
      return parseNext(
        parsingContext
          .consumeCharacter()
      )

    case undefined:
      return parsingContext

    default:
      return parseNext(
        parsingContext
          .addAction(ParsingAction.Problem())
          .addToBuffer(`Unexpected character '${parsingContext.getCharacter()}' at position ${parsingContext.getPosition()}, expecting indicators of the start of a command, such as M, C, L or Z`)
        )
  }
}

const generateCommandStartState = (Command, NextAction, errorCreator, requiredBufferLength) => parsingContext => {
  const buffer = parsingContext.getBuffer()
  if (buffer.length === requiredBufferLength) {
    return parseNext(
      parsingContext
      .getParentContext()
      .addToBuffer(Command(...buffer))
    )
  }

  switch (parsingContext.getCharacter()) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '.':
    case ',':
    case ' ':
    case '\n':
    case '\r':
    case '\t':
      return parseNext(
        parsingContext.addAction(NextAction())
      )

    default:
      return parseNext(
        parsingContext
          .getParentContext()
          .addAction(ParsingAction.Problem())
          .addToBuffer(errorCreator(parsingContext))
      )
  }
}

const generateCollectNumberState = (NextAction, errorCreator) => parsingContext => {
  switch (parsingContext.getCharacter()) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '.':
      return parseNext(
        parsingContext
          .addToBuffer(parsingContext.getCharacter())
          .consumeCharacter()
      )

    case ' ':
    case '\n':
    case '\r':
    case '\t':
      if (parsingContext.getBuffer().length === 0) {
        return parseNext(
          parsingContext.consumeCharacter()
        )
      }

    default:
      const buffer = parsingContext.getBuffer()

      if (buffer.length === 0) {
        return parseNext(
          parsingContext
            .addAction(ParsingAction.Problem())
            .addToBuffer(errorCreator(parsingContext))
        )
      }

      const x = parseFloat(buffer.join(''))
      return NextAction != null
        ? parseNext(
          parsingContext
            .getParentContext()
            .addToBuffer(x)
            .addAction(NextAction())
        )
        : parseNext(
          parsingContext
            .getParentContext()
            .addToBuffer(x)
        )
  }
}

const generateCollectCommaState = (NextAction, errorCreator) => parsingContext => {
  switch (parsingContext.getCharacter()) {
    case ' ':
    case '\n':
    case '\r':
    case '\t':
      return parseNext(
        parsingContext.consumeCharacter()
      )
    case ',':
      return parseNext(
        parsingContext
          .consumeCharacter()
          .getParentContext()
          .addAction(NextAction())
      )
    default:
      return parseNext(
        parsingContext
          .addAction(ParsingAction.Problem())
          .addToBuffer(errorCreator(parsingContext))
      )
  }
}

const fromD = d => {
  const resultingContext = parseNext(ParsingContext(d))

  return resultingContext
    .getAction()
    .match({
      Problem: () => Result.Error(resultingContext.getBuffer()[0]),
      _: () => Result.Ok(resultingContext.getBuffer())
    })
}

export default fromD
