qs = require "querystring"
xml2js = require "xml2js"
parser = new xml2js.Parser()
tar = require "tar"
fs = require "fs"
path = require "path"



# Upload file command.

exports.upload = (req, res) ->
  renderUpload = (err, data) ->
    obj = data["SOAP-ENV:Envelope"]["SOAP-ENV:Body"][0]["ns1:UploadPhoto"][0];
    
    cardConfig = @config.getCardConfig obj.macaddress
    dir = cardConfig.getDirectory()

    fs.createReadStream req.files.FILENAME.path
      .pipe tar.Extract path: dir
      .on "error", (err) ->
        @_logError "error here" + err

      .on "end", ->
        file = dir + req.files.FILENAME.filename.substr 0, req.files.FILENAME.filename.length - 4
        cardConfig.handleUploadedImage file

        _trace req.socket._idleStart.getTime()
        _trace new Date().getTime()
        _trace "\nFinished Upload successfully."

        res.render "uploadSuccess", layout: false


  decodedBody = decodeURIComponent qs.stringify qs.parse req.body.SOAPENVELOPE
  parser.parseString decodedBody, renderUpload

