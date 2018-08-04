import washington, { suite, example } from 'washington'
import fromD from './fromD'

washington(
  suite(
    'fromD',

    example(
      'basic',
      () => fromD('M0H'),
      ''
    )
  )
)
