const { runArchiveTask, parseArgs } = require('../lib/server/archiveTaskRunner')

module.exports = {
  runArchiveTask,
  parseArgs
}

if (require.main === module) {
  runArchiveTask(parseArgs(process.argv.slice(2))).catch(error => {
    console.error('音频归档任务失败:', error)
    process.exit(1)
  })
}
