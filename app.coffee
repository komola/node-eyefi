
logger = new (require "devnull") base: true

###
try
  process.setgid "prismabox"
catch err
  logger.warning "Setting Group failed"

try
  process.setuid "prismabox"
catch err
  logger.warning "Setting User failed"
###

eyefi = require "./eyefi/eyefi"
config = require "./config"

listener = new eyefi.Listener logger, new eyefi.Config config
listener.listen()

logger.log "The Node-Eyefi Server was successfully started and is listening."