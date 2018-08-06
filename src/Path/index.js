import _toD from './toD'
import _fromD from './fromD'
import _getContext2dTaskFor from './getContext2dTaskFor'

const Path = (...commands) => ({
  commands,
  toD: () => _toD(commands),
  getContext2dTaskFor: _getContext2dTaskFor(commands),
  concat: ({ commands: otherCommands }) => Path(...commands.concat(otherCommands)),
  map: f => Path(...commands.map(command => command.map(f))),
  mapX: f => Path(...commands.map(command => command.mapX(f))),
  mapY: f => Path(...commands.map(command => command.mapY(f))),
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
