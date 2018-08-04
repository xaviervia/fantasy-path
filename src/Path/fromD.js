import Maybe from 'folktale/maybe'
import Result from 'folktale/result'
import * as PathCommand from '../PathCommand'

const Action = {
  Initial: () => ({
    match: ({ Initial, _ }) =>
      Initial != null
        ? Initial()
        : _()
  }),
  MoveTo: () => ({
    match: ({ MoveTo, _ }) =>
      MoveTo != null
        ? MoveTo()
        : _()
  }),
  MoveToX: () => ({
    match: ({ MoveToX, _ }) =>
      MoveToX != null
        ? MoveToX()
        : _()
  }),
  MoveToMiddle: () => ({
    match: ({ MoveToMiddle, _ }) =>
      MoveToMiddle != null
        ? MoveToMiddle()
        : _()
  }),
  Problem: (reason) => ({
    reason,
    match: ({ Problem, _ }) =>
      Problem  != null
        ? Problem(reason)
        : _(reason)
  })
}

const ParsingContext = (
  text,
  position = 0,
  buffer = [],
  action = Action.Initial(),
  parentContext,
) => ({
  text,
  position,
  buffer,
  action,
  getAction: () => action,
  getCharacter: () => text[position],
  getBuffer: () => buffer,
  getPosition: () => position,
  getText: () => text,
  consumeCharacter: () => ParsingContext(
    text,
    position + 1,
    buffer,
    action
  ),
  addToBuffer: character => ParsingContext(
    text,
    position,
    [...buffer, character],
    action,
  ),
  addAction: newAction => ParsingContext(
    text,
    position,
    '',
    newAction,
    ParsingContext(
      text,
      position,
      buffer,
      action,
      parentContext
    )
  )
})

const isValidMoveToCharacter = character => {
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

const moveToProcess = parsingContext => pathProcessCharacter(
  isValidMoveToCharacter(parsingContext.getCharacter())
    ? parsingContext.addAction(Action.MoveToX)
    : parsingContext.popAction()
)

const moveToXProcess = parsingContext => {
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
      return pathProcessCharacter(
        parsingContext
          .addToBuffer(parsingContext.getCharacter())
          .consumeCharacter()
      )
    default:
      const buffer = parsingContext.getBuffer()

      return pathProcessCharacter(
        buffer.length === 0
          ? parsingContext
              .getParentContext()
              .addAction(
                Action.Problem(
                  `Found ${parsingContext.getCharacter()} when expecting number for the X value of MoveTo. #${parsingContext.getPosition()}`
                )
              )
          : parsingContext
              .getParentContext()
              .addToBuffer(parseInt(buffer.join('')))
              .addAction(Action.MoveToMiddle())
        )
  }
}

const initialProcess = parsingContext => {
  switch (parsingContext.getCharacter()) {
    case 'M':
      return pathProcessCharacter(
        parsingContext
          .consumeCharacter()
          .addAction(Action.MoveTo)
      )
  }
}

const moveToMiddle = parsingContext => {
  // finish, lying, for testing purposes
  return parsingContext
}

const pathProcessCharacter = parsingContext =>
  parsingContext
    .getAction()
    .match({
      Initial: () => initialProcess(parsingContext),
      MoveTo: () => moveToProcess(parsingContext),
      MoveToX: () => moveToXProcess(parsingContext),
      MoveToMiddle: () => moveToMiddle(parsingContext),
    })

const Natural = (natural) => ({
  natural,
  reduce: (reducer, init) =>
    natural === 0
      ? init
      : Natural(natural - 1)
          .reduce(reducer, reducer(init, natural))
})

const fromD = d =>
  pathProcessCharacter(ParsingContext(d))
    .getBuffer()

// import elegir from 'elegir'
//
// const bySpaces = x => x.split(/\s/)
//
// const getCommandType = x => {
//   switch (x) {
//     case 'M':
//       return 'MoveTo'
//     case 'L':
//       return 'LineTo'
//     case 'C':
//       return 'Cubic Bézier Curve'
//     case 'Z':
//       return 'ClosePath'
//     default:
//       return 'Unlabeled'
//   }
// }
//
// const parsePoint = command => {
//   const firstChar = command[0]
//   const commandType = getCommandType(firstChar)
//   const [x, y] = elegir(
//     // Unlabeled
//     commandType === 'Unlabeled',
//     command.split(',').map(x => parseFloat(x, 10)),
//     // ClosePath
//     commandType === 'ClosePath',
//     [undefined, undefined],
//     // default
//     true,
//     command
//       .slice(1)
//       .split(',')
//       .map(x => parseFloat(x, 10))
//   )
//
//   return {
//     commandType,
//     x,
//     y,
//     ...(commandType === 'Cubic Bézier Curve'
//       ? {
//           pointNumber: 0,
//         }
//       : {}),
//   }
// }
//
// const fixTypes = (fixed, command) => {
//   if (command.commandType === 'Unlabeled') {
//     if (fixed[fixed.length - 1].commandType === 'Cubic Bézier Curve') {
//       return [
//         ...fixed,
//         {
//           ...command,
//           commandType: 'Cubic Bézier Curve',
//           pointNumber: fixed[fixed.length - 1].pointNumber + 1,
//         },
//       ]
//     }
//   }
//   return [...fixed, command]
// }
//
// export default path =>
//   bySpaces(path)
//     .map(parsePoint)
//     .reduce(fixTypes, [])


// const maybeNumber = character => {
//   switch (character) {
//     case '0':
//     case '1':
//     case '2':
//     case '3':
//     case '4':
//     case '5':
//     case '6':
//     case '7':
//     case '8':
//     case '9':
//     case '.':
//       return Maybe.Just(character)
//     default:
//       return Maybe.Nothing()
//   }
// }
//
// const processNumber = parsingContext => character =>
//   maybeNumber(character)
//     .matchWith({
//       Just: () => parsingContext.addToBuffer(character),
//       Nothing: () => parsingContext.
//     })
//

////////////////////////////////////////////



export default fromD
