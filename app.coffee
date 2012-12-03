try
  process.setgid "prismabox"

catch err
  console.log "Setting Group failed"

try
  process.setuid "prismabox"
catch err
  console.log "Setting User failed"


###
Module dependencies.
###
require("./logger").init()
logger = require("./logger").logger



eyefi = require "./eyefi/eyefi"
config = require "./config"

listener = new eyefi.Listener new eyefi.Config config
listener.listen()

console.log("The Node-Eyefi Server was successfully started and is listening.");
