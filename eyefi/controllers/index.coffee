
  
exports.soap = require("./soap").soap
exports.upload = require("./upload").soap


# Human index file :)
 
exports.index = (req, res) ->
  res.render "index", layout: false
