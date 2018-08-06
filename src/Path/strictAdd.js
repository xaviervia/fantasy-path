import Result from 'folktale/result'
import { ClosePath, CubicBezierCurve, LineTo, MoveTo } from '../PathCommand'
import Point from '../Point'
//
const processCommands = (result, sourceCommands, targetCommands, consumed) => {
  if (sourceCommands.length === 0 && targetCommands.length === 0) {
    return result
  }

  if (sourceCommands.length !== targetCommands.length) {
    return Result.Error(`Source path length ${sourceCommands.length} doesn’t match the length of the target path ${targetCommands.length}`)
  }

  const sourceCommand = sourceCommands[0]
  const targetCommand = targetCommands[0]

  if (sourceCommand.commandType !== targetCommand.commandType) {
    return Result.Error(`Different command types ${sourceCommand.commandType} and ${targetCommand.commandType} at position ${position}`)
  }

  const nextResult = result.map(
    diff => [
      ...diff,
      sourceCommand.add(targetCommand)
    ]
  )

  return processCommands(
    nextResult,
    sourceCommands.slice(1),
    targetCommands.slice(1),
    consumed + 1
  )
}

const strictAdd = (sourceCommands, targetCommands) =>
  processCommands(
    Result.Ok([]),
    sourceCommands,
    targetCommands,
    0
  )

export default strictAdd
