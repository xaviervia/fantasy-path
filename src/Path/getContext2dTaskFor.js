import Context2dTask from '../Context2dTask'

const getContext2dTaskFor = commands => context2d => {
  console.log('getContext2dTaskFor', commands, context2d)
  return commands.reduce((context2dTask, command) => {
    console.log(context2dTask, command)
    return context2dTask.chain(command.getContext2dTaskFor)
  }, Context2dTask.fromContext2d(context2d))
}
export default getContext2dTaskFor
