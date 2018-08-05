import * as ParsingAction from '../ParsingAction'
import { blue, cyan } from 'chalk'

const ParsingContext = (
  text,
  position = 0,
  buffer = [],
  action = ParsingAction.Initial(),
  parentContext,
) => ({
  text,
  position,
  buffer,
  action,
  parentContext,

  getAction: () => action,
  getCharacter: () => text[position],
  getBuffer: () => buffer,
  getPosition: () => position,
  getText: () => text,

  consumeCharacter: () => ParsingContext(
    text,
    position + 1,
    buffer,
    action,
    parentContext,
  ),

  addToBuffer: character => ParsingContext(
    text,
    position,
    [...buffer, character],
    action,
    parentContext,
  ),

  addAction: newAction =>
  (console.log(`${cyan('->')} ${newAction.inspect()}`), true) &&
    ParsingContext(
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
  ),

  hasParentContext: () => parentContext != null,

  getParentContext: () =>
    (console.log(`${blue('<-')} ${parentContext.action.inspect()}`), true) && ParsingContext(
    parentContext.text,
    position,
    parentContext.buffer,
    parentContext.action,
    parentContext.parentContext
  )
})

export default ParsingContext
