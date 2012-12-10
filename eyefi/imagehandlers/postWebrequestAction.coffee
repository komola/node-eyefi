multiparter = require "multiparter"
http = require "http"
mime = require "mime"
url = require "url"
path = require "path"

class PostWebrequestAction
  constructor: (logger) ->
    @_logger = logger

  invoke: (cardConfig, filePath, fileStream) =>
    logger = @_logger
    if (configuredPost = cardConfig.get "postWebrequest")?
      settings = url.parse configuredPost
      request = new multiparter.request http,
        host: settings.hostname,
        port: settings.post, 
        path: settings.pathname,
        method: "POST"

      request.addStream "file",
        path.basename(filePath),
        mime.lookup(filePath),
        fileStream.statSync(filePath).size,
        fileStream.createReadStream(filePath)

      request.send (error, response) ->
        if error?
          logger.error "PostWebrequestAction", error
        else        
          response.setEncoding "utf8"

          data = ""

          response.on "data", (chunk) ->
            data += chunk

          response.on "end", ->
            logger.info "PostWebrequestActiont", "Response data: ", data
          
          response.on "error", (error) ->
            logger.error "PostWebrequestAction", error


module.exports = PostWebrequestAction;