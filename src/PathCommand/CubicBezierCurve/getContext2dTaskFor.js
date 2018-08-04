import { task } from 'folktale/concurrency/task'
import Context2dTask from '../../Context2dTask'

const getContext2dTaskFor = (start, middle, end) => context2d =>
  Context2dTask.fromContext2d(context2d)
    .chain(context2d => Context2dTask(
      task(resolver => {
        context2d.bezierCurveTo(
          start.x,
          start.y,
          middle.x,
          middle.y,
          end.x,
          end.y
        )
        resolver.resolve(context2d)
      })
    ))

export default getContext2dTaskFor
