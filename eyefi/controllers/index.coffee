
  
exports.soap = require("./soap").soap
upl = require("./upload")
exports.upload = upl.upload
exports.preUpload = upl.preUpload

# Human index file :)
 
exports.index = (req, res) ->
  res.render "index", layout: false