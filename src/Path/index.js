import _toD from './toD'
import _getContext2dTaskFor from './getContext2dTaskFor'

const Path = (...commands) => ({
  commands,
  toD: () => _toD(commands),
  getContext2dTaskFor: _getContext2dTaskFor(commands),
  map: f => Path(...commands.map(command => command.map(f)))
})

export const toD = _toD
export const getContext2dTaskFor = _getContext2dTaskFor
export default Path
