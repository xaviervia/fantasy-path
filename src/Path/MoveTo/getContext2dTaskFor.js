import { task } from 'folktale/concurrency/task'
import Context2dTask from '../../Context2dTask'

const getContext2dTaskFor = (x, y) => context2d =>
  Context2dTask.fromContext2d(context2d)
    .chain(context2d => Context2dTask(
      task(resolver => {
        context2d.moveTo(x, y)
        resolver.resolve(context2d)
      })
    ))

export default getContext2dTaskFor
