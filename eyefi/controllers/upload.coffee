qs = require "querystring"
xml2js = require "xml2js"
parser = new xml2js.Parser()
tar = require "tar"
fs = require "fs"
path = require "path"
formidable = require "formidable"


# Upload file command.

exports.preUpload = (req, res, next) ->
  logger = @_logger
 
  if req.url == "/api/soap/eyefilm/v1/upload"
    logger.log "ImageUpload", "Accepting Image Upload Request from ", req.connection.remoteAddress, ")"

    form = new formidable.IncomingForm()
    startTime = new Date()
    old = 0

    form.on "progress", (received, expected) ->
      if old != Math.round(received * 100 / expected) && Math.round(received * 100 / expected) % 10 == 0
        logger.log "Upload", Math.round(received * 100 / expected)
      old = Math.round(received * 100 / expected)

    form.on "end", ->
      timeTaken = (new Date().getTime() - startTime.getTime()) / 1000
      kbs = (req.headers["content-length"] / 1024) / timeTaken
      logger.info "Upload", "Image upload finished in ", timeTaken + "s - " + kbs + "kb/s"

    form.parse req
  next()


exports.upload = (req, res) ->
  handleImageUploadFinished = @_handleImageUploadFinished
  config = @_config
  logger = @_logger

  


  decodedBody = decodeURIComponent qs.stringify qs.parse req.body.SOAPENVELOPE
  parser.parseString decodedBody, (err, data) ->
    obj = data["SOAP-ENV:Envelope"]["SOAP-ENV:Body"][0]["ns1:UploadPhoto"][0];
    
    cardConfig = config.getCardConfig obj.macaddress
    dir = cardConfig.getDirectory()

    stream = fs.createReadStream req.files.FILENAME.path
    stream.pipe tar.Extract { path: dir }
    stream.on "error", (err) ->
      logger.error "ImageUpload", err

    stream.on "end", ->
      filePath = dir + req.files.FILENAME.filename.substr 0, req.files.FILENAME.filename.length - 4
      
      handleImageUploadFinished cardConfig, filePath, fs

      res.render "uploadSuccess", layout: false

      #logger.trace req.socket._idleStart.getTime()
      logger.info "ImageUpload", "Finished Upload successfully"