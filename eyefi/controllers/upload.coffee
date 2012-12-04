qs = require "querystring"
xml2js = require "xml2js"
parser = new xml2js.Parser()
tar = require "tar"
fs = require "fs"
path = require "path"


# Upload file command.

exports.upload = (req, res) ->
  config = @_config
  logger = @_logger

  logger.log "ImageUpload", "Accepting Upload Request"

  renderUpload = (err, data) ->
    obj = data["SOAP-ENV:Envelope"]["SOAP-ENV:Body"][0]["ns1:UploadPhoto"][0];
    
    cardConfig = config.getCardConfig obj.macaddress
    dir = cardConfig.getDirectory()

    stream = fs.createReadStream req.files.FILENAME.path
    stream.pipe tar.Extract { path: dir }
    stream.on "error", (err) ->
      logger.error "ImageUpload", err

    stream.on "end", ->
      file = dir + req.files.FILENAME.filename.substr 0, req.files.FILENAME.filename.length - 4
      cardConfig.handleUploadedImage file, fs

      #logger.trace req.socket._idleStart.getTime()
      logger.info "Finished Upload successfully."

      res.render "uploadSuccess", layout: false


  decodedBody = decodeURIComponent qs.stringify qs.parse req.body.SOAPENVELOPE
  parser.parseString decodedBody, renderUpload