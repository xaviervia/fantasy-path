import Maybe from 'folktale/maybe'
import Result from 'folktale/result'
import { LineTo, MoveTo } from '../PathCommand'
import * as ParsingAction from './ParsingAction'
import ParsingContext from './ParsingContext'
import { magenta } from 'chalk'

const parseNext = parsingContext => {
  console.log(`${magenta('<>')} ${parsingContext.getAction().inspect()}`, parsingContext.getBuffer())

  return parsingContext
    .getAction()
    .match({
      Initial: () => initialState(parsingContext),
      LineTo: () => lineToState(parsingContext),
      LineToX: () => lineToXState(parsingContext),
      LineToMiddle: () => lineToMiddleState(parsingContext),
      LineToY: () => lineToYState(parsingContext),
      MoveTo: () => moveToState(parsingContext),
      MoveToX: () => moveToXState(parsingContext),
      MoveToMiddle: () => moveToMiddleState(parsingContext),
      MoveToY: () => moveToYState(parsingContext),
      Problem: () => parsingContext,
    })
}

const isValidNumberCharacter = character => {
  switch (character) {
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
      return true
  }

  return false
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

    case ' ':
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

const lineToState = parsingContext => {
  const buffer = parsingContext.getBuffer()
  if (buffer.length === 2) {
    return parseNext(
      parsingContext
      .getParentContext()
      .addToBuffer(LineTo(buffer[0], buffer[1]))
    )
  } else {
    if (isValidNumberCharacter(parsingContext.getCharacter())) {
      return parseNext(
        parsingContext.addAction(ParsingAction.LineToX())
      )
    }

    return parseNext(
      parsingContext
        .getParentContext()
        .addAction(ParsingAction.Problem())
        .addToBuffer(`Unterminated LineTo (L) command at character ${parsingContext.position}, please ensure the L is followed by two float or integer numbers representing X and Y coordinates, separated by a comma.`)
    )
  }
}

const lineToXState = parsingContext => {
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

    default:
      const buffer = parsingContext.getBuffer()

      if (buffer.length === 0) {
        return parseNext(
          parsingContext
            .addAction(ParsingAction.Problem())
            .addToBuffer(`Comma found when expecting a number in a LineTo (L) command at character ${parsingContext.position}, please ensure the L is followed by a float indicating the value for the X coordinate.`)
        )
      }

      const x = parseFloat(buffer.join(''))
      return parseNext(
        parsingContext
          .getParentContext()
          .addToBuffer(x)
          .addAction(ParsingAction.LineToMiddle())
      )
  }
}

const lineToMiddleState = parsingContext => {
  switch (parsingContext.getCharacter()) {
    case ' ':
      return parseNext(
        parsingContext.consumeCharacter()
      )
    case ',':
      return parseNext(
        parsingContext
          .consumeCharacter()
          .getParentContext()
          .addAction(ParsingAction.LineToY())
      )
    default:
      return parseNext(
        parsingContext
          .addAction(ParsingAction.Problem())
          .addToBuffer(`Unexpected character '${parsingContext.getCharacter()}' in position ${parsingContext.getPosition()}, after the X coordinate value of a LineTo there should be a comma, and optionally spaces.`)
      )
  }
}

const lineToYState = parsingContext => {
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
      if (parsingContext.getBuffer().length === 0) {
        return parseNext(
          parsingContext.consumeCharacter()
        )
      }

    default:
      const buffer = parsingContext.getBuffer()

      if (buffer.length === 0) {
        const error = parsingContext.getCharacter() === undefined
          ? `Unexpected end of text when expecting a number in a LineTo (L) command at position ${parsingContext.position}, please ensure there is a Y value after the comma.`
          : `Character ${parsingContext.getCharacter()} found when expecting a number in a LineTo (L) command at position ${parsingContext.position}, please ensure there is a Y value after the comma.`
        return parseNext(
          parsingContext
            .addAction(ParsingAction.Problem())
            .addToBuffer(error)
        )
      }

      const x = parseFloat(buffer.join(''))
      return parseNext(
        parsingContext
          .getParentContext()
          .addToBuffer(x)
      )
  }
}

const moveToState = parsingContext => {
  const buffer = parsingContext.getBuffer()
  if (buffer.length === 2) {
    return parseNext(
      parsingContext
        .getParentContext()
        .addToBuffer(MoveTo(buffer[0], buffer[1]))
    )
  } else {
    if (isValidNumberCharacter(parsingContext.getCharacter())) {
      return parseNext(
        parsingContext.addAction(ParsingAction.MoveToX())
      )
    }
    return parseNext(
      parsingContext
        .getParentContext()
        .addAction(ParsingAction.Problem())
        .addToBuffer(`Unterminated MoveTo (M) command at character ${parsingContext.position}, please ensure the M is followed by two float or integer numbers representing X and Y coordinates, separated by a comma.`)
    )
  }
}

const moveToXState = parsingContext => {
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

    default:
      const buffer = parsingContext.getBuffer()

      if (buffer.length === 0) {
        return parseNext(
          parsingContext
            .addAction(ParsingAction.Problem())
            .addToBuffer(`Comma found when expecting a number in a MoveTo (M) command at character ${parsingContext.position}, please ensure the M is followed by a float indicating the value for the X coordinate.`)
        )
      }

      const x = parseFloat(buffer.join(''))
      return parseNext(
        parsingContext
          .getParentContext()
          .addToBuffer(x)
          .addAction(ParsingAction.MoveToMiddle())
      )
  }
}

const moveToMiddleState = parsingContext => {
  switch (parsingContext.getCharacter()) {
    case ' ':
      return parseNext(
        parsingContext.consumeCharacter()
      )
    case ',':
      return parseNext(
        parsingContext
          .consumeCharacter()
          .getParentContext()
          .addAction(ParsingAction.MoveToY())
      )
    default:
      return parseNext(
        parsingContext
          .addAction(ParsingAction.Problem())
          .addToBuffer(`Unexpected character '${parsingContext.getCharacter()}' in position ${parsingContext.getPosition()}, after the X coordinate value of a MoveTo there should be a comma, and optionally spaces.`)
      )
  }
}

const moveToYState = parsingContext => {
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
      if (parsingContext.getBuffer().length === 0) {
        return parseNext(
          parsingContext.consumeCharacter()
        )
      }

    default:
      const buffer = parsingContext.getBuffer()

      if (buffer.length === 0) {
        const error = parsingContext.getCharacter() === undefined
          ? `Unexpected end of text when expecting a number in a MoveTo (M) command at position ${parsingContext.position}, please ensure there is a Y value after the comma.`
          : `Character ${parsingContext.getCharacter()} found when expecting a number in a MoveTo (M) command at position ${parsingContext.position}, please ensure there is a Y value after the comma.`
        return parseNext(
          parsingContext
            .addAction(ParsingAction.Problem())
            .addToBuffer(error)
        )
      }

      const x = parseFloat(buffer.join(''))
      return parseNext(
        parsingContext
          .getParentContext()
          .addToBuffer(x)
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
