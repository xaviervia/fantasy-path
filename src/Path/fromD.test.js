import washington, { suite, example } from 'washington'
import { LineTo, MoveTo } from '../PathCommand'
import fromD from './fromD'

washington(
  suite(
    'fromD',

    example(
      'unterminated M',
      () => fromD('M').matchWith({Error: ({value}) => value }),
      'Unterminated MoveTo (M) command at character 1, please ensure the M is followed by two float or integer numbers representing X and Y coordinates, separated by a comma.'
    ),

    example(
      'M,',
      () => fromD('M,').matchWith({Error: ({value}) => value }),
      'Comma found when expecting a number in a MoveTo (M) command at character 1, please ensure the M is followed by a float indicating the value for the X coordinate.'
    ),

    example(
      'M0.4ø',
      () => fromD('M0.4ø')
        .matchWith({ Error: ({value}) => value}),
      'Unexpected character \'ø\' in position 4, after the X coordinate value of a MoveTo there should be a comma, and optionally spaces.'
    ),

    example(
      'M0.4  ,',
      () => fromD('M0.4  ,')
        .matchWith({ Error: ({value}) => value }),
      'Unexpected end of text when expecting a number in a MoveTo (M) command at position 7, please ensure there is a Y value after the comma.'
    ),

    example(
      'M0.4, 8',
      () => fromD('M0.4, 8')
        .matchWith({ Ok: ({value}) => value})
        .map(x => x.toJSON()),
      [
        MoveTo(0.4, 8).toJSON()
      ]
    ),

    example(
      'K',
      () => fromD('K')
        .matchWith({ Error: ({value}) => value}),
      'Unexpected character \'K\' at position 0, expecting indicators of the start of a command, such as M, C, L or Z'
    ),

    example(
      'L',
      () => fromD('L')
        .matchWith({ Error: ({value}) => value}),
      'Unterminated LineTo (L) command at character 1, please ensure the L is followed by two float or integer numbers representing X and Y coordinates, separated by a comma.'
    ),

    example(
      'L,',
      () => fromD('L,')
        .matchWith({ Error: ({value}) => value}),
      'Comma found when expecting a number in a LineTo (L) command at character 1, please ensure the L is followed by a float indicating the value for the X coordinate.'
    ),

    example(
      'L0.4ø',
      () => fromD('L0.4ø')
        .matchWith({ Error: ({value}) => value}),
      'Unexpected character \'ø\' in position 4, after the X coordinate value of a LineTo there should be a comma, and optionally spaces.'
    ),

    example(
      'L0.4  ,',
      () => fromD('L0.4  ,')
        .matchWith({ Error: ({value}) => value}),
      'Unexpected end of text when expecting a number in a LineTo (L) command at position 7, please ensure there is a Y value after the comma.'
    ),

    example(
      'L0.4, 8',
      () => fromD('L0.4, 8')
        .matchWith({ Ok: ({value}) => value})
        .map(x => x.toJSON()),
      [
        LineTo(0.4, 8).toJSON()
      ]
    ),

    example(
      'M50,50 L6.7,0.3',
      () => fromD('M50,50 L6.7,0.3')
        .matchWith({ Ok: ({value}) => value})
        .map(x => x.toJSON()),
      [
        MoveTo(50, 50).toJSON(),
        LineTo(6.7, 0.3).toJSON()
      ]
    ),

    example(
      'M50,50 L6.7,0.3 L5,4',
      () => fromD('M50,50 L6.7,0.3 L5,4')
        .matchWith({ Ok: ({value}) => value})
        .map(x => x.toJSON()),
      [
        MoveTo(50, 50).toJSON(),
        LineTo(6.7, 0.3).toJSON(),
        LineTo(5, 4).toJSON()
      ]
    ),
  ).filter(({description}) => /M50,50 L6.7,0.3/.test(description))
)
