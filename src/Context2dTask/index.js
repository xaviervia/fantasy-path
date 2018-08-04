import { task } from 'folktale/concurrency/task'

const Context2dTask = context2dTask => ({
  context2dTask,

  beginPath: () =>
    Context2dTask(
      context2dTask.chain(context2d =>
        task(resolver => {
          context2d.beginPath()
          resolver.resolve(context2d)
        })
      )
    ),

  map: f => Context2dTask(context2dTask.map(f)),

  chain: f => Context2dTask(
    context2dTask.chain(context2d => f(context2d).context2dTask)
  ),

  run: () => context2dTask.run(),
})

Context2dTask.fromContext2d = context2d =>
  Context2dTask(task(resolver => resolver.resolve(context2d)))

export default Context2dTask
