import _getContext2dTaskFor from './getContext2dTaskFor'

const ClosePath = () => ({
  commandType: 'ClosePath',
  toD: () => 'Z',
  getContext2dTaskFor: _getContext2dTaskFor(),
  map: ClosePath,
  mapX: ClosePath,
  mapY: ClosePath,
  toJSON: () => ({
    commandType: 'ClosePath',
  }),
  match: ({ClosePath, _}) =>
    ClosePath != null ? ClosePath() : _()
})

export default ClosePath
