import washington, { suite, example } from 'washington'
import { ClosePath, CubicBezierCurve, LineTo, MoveTo } from '../PathCommand'
import Point from '../Point'
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

    example(
      'unterminated C',
      () => fromD('C').matchWith({Error: ({value}) => value }),
      'Unterminated CubicBezierCurve (C) command at character 1, please ensure the C is followed by three sets of points separated by spaces, each consisting of two float or integer numbers representing X and Y coordinates, separated by a comma.'
    ),

    example(
      'C,',
      () => fromD('C,').matchWith({Error: ({value}) => value }),
      'Comma found when expecting a number in a CubicBezierCurve (C) command at character 1, please ensure the C is followed by three sets of points separated by spaces, each consisting of two float or integer numbers representing X and Y coordinates, separated by a comma.'
    ),

    example(
      'C0.4ø',
      () => fromD('C0.4ø')
        .matchWith({ Error: ({value}) => value}),
      'Unexpected character \'ø\' in position 4, after the X coordinate value of a CubicBezierCurve there should be a comma, and optionally spaces.'
    ),

    example(
      'C0.4  ,',
      () => fromD('C0.4  ,')
        .matchWith({ Error: ({value}) => value}),
      'Unexpected end of text when expecting a number in a CubicBezierCurve (C) command at position 7, please ensure there is a Y value after the comma.'
    ),

    example(
      'C0.4,7',
      () => fromD('C0.4,7')
        .matchWith({ Error: ({value}) => value}),
      'Unexpected end of text when expecting a number in a CubicBezierCurve (C) command at position 6. Only one set of X and Y values found, there should be three.'
    ),

    example(
      'C0.4,7 ,',
      () => fromD('C0.4,7 ,')
        .matchWith({ Error: ({value}) => value}),
      'Comma found when expecting a number in a CubicBezierCurve (C) command at character 7, please ensure the C is followed by three sets of points separated by spaces, each consisting of two float or integer numbers representing X and Y coordinates, separated by a comma.'
    ),

    example(
      'C0.4,7 5,4',
      () => fromD('C0.4,7 5,4')
        .matchWith({ Error: ({value}) => value}),
      'Unexpected end of text when expecting a number in a CubicBezierCurve (C) command at position 10. Only two set of X and Y values found, there should be three.'
    ),

    example(
      'C0.4,7 5,4 2,4',
      () => fromD('C0.4,7 5,4 2,4')
        .matchWith({ Ok: ({value}) => value})
        .map(x => x.toJSON()),
      [
        CubicBezierCurve(Point(0.4, 7), Point(5, 4), Point(2, 4)).toJSON()
      ]
    ),

    example(
      'Z',
      () => fromD('Z').matchWith({ Ok: ({value}) => value })
      .map(x => x.toJSON()),
      [
        ClosePath().toJSON()
      ]
    ),

    example(
      'full curve',
      () => fromD('M08,2 L2,4 C5,6 7.8,9 2,3 Z')
        .matchWith({
          Ok: ({value}) => value
        })
        .map(x => x.toJSON()),
      [
        MoveTo(8, 2).toJSON(),
        LineTo(2,4).toJSON(),
        CubicBezierCurve(Point(5, 6), Point(7.8, 9), Point(2, 3)).toJSON(),
        ClosePath().toJSON()
      ]
    ),

    example(
      'accept \\n, \\r and \\t',
      () => fromD('M08,2 \n L2,4\r C5,6\t7.8,9 2,3 Z')
        .matchWith({
          Ok: ({value}) => value
        })
        .map(x => x.toJSON()),
      [
        MoveTo(8, 2).toJSON(),
        LineTo(2,4).toJSON(),
        CubicBezierCurve(Point(5, 6), Point(7.8, 9), Point(2, 3)).toJSON(),
        ClosePath().toJSON()
      ]
    )
  ).filter(({description}) => /./.test(description))
)
