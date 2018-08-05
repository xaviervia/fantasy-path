import Maybe from 'folktale/maybe'
import Result from 'folktale/result'
import { LineTo, MoveTo } from '../PathCommand'
import * as ParsingAction from './ParsingAction'
import ParsingContext from './ParsingContext'
import * as parsingErrors from './parsingErrors'
import { magenta } from 'chalk'

const parseNext = parsingContext => {
  console.log(`${magenta('<>')} ${parsingContext.getAction().inspect()}`, parsingContext.getBuffer())

  return parsingContext
    .getAction()
    .match({
      Initial: () => initialState(parsingContext),

      LineTo: () => generateCommandStartState(
        LineTo,
        ParsingAction.LineToX,
        parsingErrors.unterminatedLineTo
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
        parsingErrors.unterminatedMoveTo
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

const generateCommandStartState = (Command, NextAction, errorCreator) => parsingContext => {
  const buffer = parsingContext.getBuffer()
  if (buffer.length === 2) {
    return parseNext(
      parsingContext
      .getParentContext()
      .addToBuffer(Command(buffer[0], buffer[1]))
    )
  } else {
    if (isValidNumberCharacter(parsingContext.getCharacter())) {
      return parseNext(
        parsingContext.addAction(NextAction())
      )
    }

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
