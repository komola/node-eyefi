qs = require "querystring"
xml2js = require "xml2js"
parser = new xml2js.Parser()
crypto = require "crypto"


md5HexDigest = (data) ->
  string = new Buffer data, "hex"
  hash = crypto.createHash "md5"
  hash.update string
  hash.digest "hex"  



exports.soap = (req, res) ->  
  renderStartSession = (err, data) ->
    obj = data["SOAP-ENV:Envelope"]["SOAP-ENV:Body"][0]["ns1:StartSession"][0]		
    
    if (config = @config.getCardConfig obj.macaddress)?
      credential = md5HexDigest obj.macaddress + obj.cnonce + config.getUploadKey()
      res.render 'startSession', 
        layout: false
        "credential": credential
        "snonce": "d7eda40e374e8a34ee97554ebbfea0b5"
        "transfermodetimestamp": obj.transfermodetimestamp  
  
  
  renderGetPhotoStatus = (err, data) ->
    obj = data["SOAP-ENV:Envelope"]["SOAP-ENV:Body"][0]["ns1:GetPhotoStatus"][0]
    res.render 'getPhotoStatus', layout: false


  renderMarkLastPhotoInRoll = (err, data) ->
    res.render "markLastPhotoInRoll", layout: false

# Get add data in the SOAP-Request

  getData = (callback) ->
    body = '';
    parsedbody = '';
    req.on 'data', (data) ->
      body += data

    req.on 'end', ->
      decodedBody = decodeURIComponent qs.stringify qs.parse body
      parser.parseString decodedBody, callback

# Decide what kind of SOAP request this was.

  switch req.headers.soapaction.substr 5, req.headers.soapaction.length - 6
    when "StartSession"
      console.log("StartSession");
      getData(renderStartSession);

    when "GetPhotoStatus"
      console.log("GetPhotoStatus");
      getData(renderGetPhotoStatus);

    when "MarkLastPhotoInRoll"
      console.log("MarkLastPhotoInRoll");
      getData(renderMarkLastPhotoInRoll);

    else
      console.log("Different request - We don't really know what to do!", req.headers);
      length = req.headers.soapaction.length;
      console.log(length-2);
      console.log(req.headers.soapaction.substr(5, req.headers.soapaction.length-6));
