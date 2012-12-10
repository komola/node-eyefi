exec  = require('child_process').exec
path = require "path"

class CommandAction
  constructor: (logger) ->
    @_logger = logger

  invoke: (cardConfig, filePath, fileStream) =>
    logger = @_logger
    if (configuredCommand = cardConfig.get "command")?
      command = util.format configuredCommand, path.normalize filePath
      logger.log "CommandAction", "Execute Command: ", command, " for file: ", filePath
      child = exec command, (error, stdout, stderr) ->
        logger.info "CommandAction", "stdout: ", stdout
        logger.info "CommandAction", "stderr: ", stderr
        if error?
          logger.error "CommandAction", error


module.exports = CommandAction;