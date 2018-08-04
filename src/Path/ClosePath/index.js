import _getContext2dTaskFor from './getContext2dTaskFor'

const ClosePath = () => ({
  commandType: 'ClosePath',
  toD: () => 'Z',
  getContext2dTaskFor: _getContext2dTaskFor()
})

export default ClosePath
