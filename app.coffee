
logger = new (require "devnull") base: true

config = require "./config"

if config.groupId?
  try
    process.setgid config.groupId
  catch err
    logger.warning "Setting Group failed"

if config.userId?
  try
    process.setuid config.userId
  catch err
    logger.warning "Setting User failed"

eyefi = require "./eyefi"

listener = new eyefi.Listener logger, new eyefi.Config config
listener.addImageUploadFinishedHandler new (require "./eyefi/imagehandlers/commandAction") logger
listener.addImageUploadFinishedHandler new (require "./eyefi/imagehandlers/postWebrequestAction") logger

listener.listen()

logger.info "The Node-Eyefi Server is running."