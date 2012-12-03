
express = require "express"
formidable = require "formidable"
ejs = require "ejs"

controllers = require "./controllers"

bind = (fn, me) -> -> fn.apply me, arguments

class EyefiListener
  constructor: (config) ->
    @app = express.createServer()
    
    @app.configure =>
      @app.use (req, res, next) ->
        console.log req.connection.remoteAddress
        if req.url == "/api/soap/eyefilm/v1/upload"
          form = new formidable.IncomingForm()
          startTime = new Date()
          old = 0
          console.log "Starting upload"
          # We can"t use progressbars because there are two files at the same time.
          form.on "progress", (received, expected) ->
            if old != Math.round(received * 100 / expected) && Math.round(received * 100 / expected) % 10 == 0
              console.log Math.round(received * 100 / expected)
            old = Math.round(received * 100 / expected)
        
          form.on "end", ->
            timeTaken = (new Date().getTime() - startTime.getTime()) / 1000
            kbs = (req.headers["content-length"] / 1024) / timeTaken
            console.log timeTaken + " - " + kbs + "kb/s"

          form.parse req
        next()

      @app.set "views", __dirname + "/responses"
      @app.register "html", ejs
      @app.set "view engine", "html"
      @app.use express.bodyParser()
      @app.use express.methodOverride()
      @app.use @app.router
    

      @app.get "/", bind controllers.index
      @app.post "/api/soap/eyefilm/v1", bind controllers.soap
      @app.post "/api/soap/eyefilm/v1/upload", bind controllers.upload
    
    
    @app.configure "development", =>
      @app.use express.errorHandler, dumpExceptions: true, showStack: true

    @app.configure "production", =>
      @app.use express.errorHandler() 
      
      

      
  listen: =>
    @app.listen 59278

  _logError: (error) =>
    console.log error
    
  _trace: (message) =>
    console.log message
    
    
exports.Listener = EyefiListener
exports.Config = require("./eyeficonfig").Config
    