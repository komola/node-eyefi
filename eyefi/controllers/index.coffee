
  
exports.soap = require("./soap").soap
exports.upload = require("./upload").upload


# Human index file :)
 
exports.index = (req, res) ->
  res.render "index", layout: false