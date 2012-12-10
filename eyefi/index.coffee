
express = require "express"
ejs = require "ejs"

controllers = require "./controllers"

bind = (fn, me) -> -> fn.apply me, arguments

class EyefiListener
  constructor: (logger, config) ->
    @_logger = logger
    @_config = config
    @_imageUploadFinishedHandler = []
    @_app = express.createServer()
    
    @_app.configure =>

      @_app.use bind controllers.preUpload, @

      @_app.set "views", __dirname + "/responses"
      @_app.register "html", ejs
      @_app.set "view engine", "html"
      @_app.use express.bodyParser()
      @_app.use express.methodOverride()
      @_app.use @_app.router
    

      @_app.get "/", bind controllers.index, @
      @_app.post "/api/soap/eyefilm/v1", bind controllers.soap, @
      @_app.post "/api/soap/eyefilm/v1/upload", bind controllers.upload, @
    
    
    @_app.configure "development", =>
      @_app.use express.errorHandler dumpExceptions: true, showStack: true

    @_app.configure "production", =>
      @_app.use express.errorHandler() 
      

  _handleImageUploadFinished: (cardConfig, filePath, fileStream) =>
    for handler in @_imageUploadFinishedHandler
      handler.invoke cardConfig, filePath, fileStream

  addImageUploadFinishedHandler: (handler) =>
    @_imageUploadFinishedHandler.push handler
      
  listen: =>
    @_app.listen 59278
    
    
exports.Listener = EyefiListener
exports.Config = require("./config").Config