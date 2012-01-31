var qs = require("querystring"),
    xml2js = require("xml2js"),
    parser = new xml2js.Parser(),
    config = require("../config"),
    crypto = require("crypto"),
    tar = require("tar"),
    fs = require("fs"),
    util = require("util"),
    exec  = require('child_process').exec,
    child,
    path = require("path");

/*
 * GET home page.
 */

function md5HexDigest(data)
{
  var string = new Buffer(data, "hex");
  var hash = crypto.createHash("md5");
  hash.update(string);
  return hash.digest("hex");  
}


exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.upload = function(req, res) {
  var renderUpload = function(err, data) {
    var obj = data["SOAP-ENV:Body"]["ns1:UploadPhoto"];
    var folder = config.folder;
    if(config.cards[obj.macaddress].folder) {
      folder = config.cards[obj.macaddress].folder;
    }

    fs.createReadStream(req.files.FILENAME.path)
      .pipe(tar.Extract({ path: folder }))
      .on("error", function (err) {
        console.error("error here")
      })
      .on("end", function () {
        if(config.cards[obj.macaddress].command) {
          var file = folder+req.files.FILENAME.filename.substr(0, req.files.FILENAME.filename.length -4);
          
          console.log(file);
          var command = util.format(config.cards[obj.macaddress].command, path.normalize(file));
          console.log(command);
          child = exec(command, function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
              console.log('exec error: ' + error);
            }
          });
        }
        console.log("UploadSuccess");
        res.render('uploadSuccess', {layout: false});
      })

    
  };

  var decodedBody = decodeURIComponent(qs.stringify(qs.parse(req.body.SOAPENVELOPE)));
  parser.parseString(decodedBody, renderUpload); 
};

exports.soap = function(req, res) {  
  //api.eye.fi:80
  //StartSession
  //GetCardSettings
  //?:59278
  //StartSession
  //GetPhotoStatus
  //MarkLastPhotoInRoll
  var renderStartSession = function(err, data) {
    var obj = data["SOAP-ENV:Body"]["ns1:StartSession"];
    var credential = md5HexDigest(obj.macaddress + obj.cnonce + config.cards[obj.macaddress].uploadkey);
    res.render('startSession', {layout:false, "credential": credential, "snonce":"d7eda40e374e8a34ee97554ebbfea0b5", "transfermodetimestamp": obj.transfermodetimestamp});  
  };

  var renderGetPhotoStatus = function(err, data) {
    var obj = data["SOAP-ENV:Body"]["ns1:GetPhotoStatus"];
    var credential = md5HexDigest(obj.macaddress + config.cards[obj.macaddress].uploadkey + "d7eda40e374e8a34ee97554ebbfea0b5");
    res.render('getPhotoStatus', {layout:false});
  };

  var getData = function(callback) {
    var body = '';
    var parsedbody = '';
    req.on('data', function (data) {
      body += data;
    }); 
    req.on('end', function () {
      var decodedBody = decodeURIComponent(qs.stringify(qs.parse(body)));
      parser.parseString(decodedBody, callback);
    });
  };

  switch(req.headers.soapaction.substr(5, req.headers.soapaction.length-6)) {
    case "StartSession":
      console.log("startsession");
      //console.log(req.params);
      getData(renderStartSession);
      break;
    case "GetPhotoStatus":
      console.log("GetPhotoStatus");
      getData(renderGetPhotoStatus);
      break;
    case "MarkLastPhotoInRoll":
      res.render('markLastPhotoInRoll', {layout: false});
      break;
    default:
      console.log("Different request", req.headers);
      var length = req.headers.soapaction.length;
      console.log(length-2);
      console.log(req.headers.soapaction.substr(5, req.headers.soapaction.length-6));
      break;
  }
};

// Mitschnitt
// POST /loc/json HTTP/1.1
// Host: www.google.com
// User-Agent: Mozilla/5.0 (Windows; U; Windows NT 6.1; de; rv:1.9.2.25) Gecko/20111212 Firefox/3.6.25
// Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
// Accept-Language: de-de,de;q=0.8,en-us;q=0.5,en;q=0.3
// Accept-Encoding: gzip,deflate
// Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
// Keep-Alive: 115
// Connection: keep-alive
// Content-Length: 1067
// Content-Type: text/plain; charset=UTF-8
// Pragma: no-cache
// Cache-Control: no-cache
// {"version":"1.1.0","request_address":true,"access_token":"2:L7MQY8kub3DN_do_:3pusanbwJID_Zu6q","wifi_towers":[{"mac_address":"7c-4f-b5-21-ed-94","ssid":"INTERNET","signal_strength":-33},{"mac_address":"88-25-2c-54-30-07","ssid":"WLAN-543029","signal_strength":-51},{"mac_address":"00-25-5e-74-e4-db","ssid":"ALICE-WLANDA","signal_strength":-79},{"mac_address":"28-cf-da-b8-d5-cd","ssid":"redbirn","signal_strength":-85},{"mac_address":"00-26-4d-3c-94-1f","ssid":"EasyBox-3C9439","signal_strength":-73},{"mac_address":"00-1d-19-eb-91-47","ssid":"WLAN-EB9166","signal_strength":-86},{"mac_address":"00-12-bf-b2-b7-c5","ssid":"WLAN-B2B705","signal_strength":-80},{"mac_address":"88-25-2c-21-a6-ef","ssid":"EasyBox-21A645","signal_strength":-79},{"mac_address":"04-c0-6f-d4-7d-14","ssid":"WLAN-7D1407","signal_strength":-91},{"mac_address":"7c-4f-b5-83-f8-f7","ssid":"Toner_Schoerke","signal_strength":-67},{"mac_address":"f0-7d-68-8e-59-2e","ssid":"Lian","signal_strength":-89},{"mac_address":"bc-05-43-e2-a8-e2","ssid":"FRITZ!Box Fon WLAN 7112","signal_strength":-76}]}