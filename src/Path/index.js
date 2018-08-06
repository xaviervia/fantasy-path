import _toD from './toD'
import _fromD from './fromD'
import _getContext2dTaskFor from './getContext2dTaskFor'
import _strictDiffWith from './strictDiffWith'
import _strictAdd from './strictAdd'

const Path = (...commands) => ({
  commands,
  toD: () => _toD(commands),
  getContext2dTaskFor: _getContext2dTaskFor(commands),
  concat: ({ commands: otherCommands }) => Path(...commands.concat(otherCommands)),
  map: f => Path(...commands.map(command => command.map(f))),
  mapX: f => Path(...commands.map(command => command.mapX(f))),
  mapY: f => Path(...commands.map(command => command.mapY(f))),
  strictDiffWith: targetPath => _strictDiffWith(commands, targetPath.commands)
    .map(differenceCommands => Path(...differenceCommands)),
  strictAdd: targetPath => _strictAdd(commands, targetPath.commands)
    .map(addedCommands => Path(...addedCommands)),
})

Path.empty = () => Path()

export const fromD = d =>
  _fromD(d)
    .map(commands => Path(...commands))

export const toD = _toD
export const getContext2dTaskFor = _getContext2dTaskFor

Path.fromD = fromD
Path.toD = toD
Path.getContext2dTaskFor = getContext2dTaskFor

export default Path
