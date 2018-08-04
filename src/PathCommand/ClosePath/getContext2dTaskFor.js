import { task } from 'folktale/concurrency/task'
import Context2dTask from '../../Context2dTask'

const getContext2dTaskFor = () => context2d =>
  Context2dTask.fromContext2d(context2d).chain(context2d =>
    Context2dTask(
      task(resolver => {
        context2d.closePath()
        resolver.resolve(context2d)
      })
    )
  )

export default getContext2dTaskFor
