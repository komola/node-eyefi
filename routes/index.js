var qs = require("querystring"),
    xml2js = require("xml2js"),
    parser = new xml2js.Parser(),
    md5 = require("MD5");
var config = require("../config");
var crypto = require("crypto");
var tar = require("tar");
var fs = require("fs");

/*
 * GET home page.
 */
var long = "00185642b77d"+"e83bee6ad0fa752888892f49b95b7a4e"+"50333eaad68ce9f73db40bad23a2952c";


//console.log(md5(new Buffer("\\x00\\x18VB\\xb7}\\xe8;\\xeej\\xd0\\xfau(\\x88\\x89/I\\xb9[zNP3>\\xaa\\xd6\\x8c\\xe9\\xf7=\\xb4\\x0b\\xad#\\xa2\\x95,", "utf8").toString("hex")));
//console.log(long);
// hex '\x00\x18VB\xb7}\xe8;\xeej\xd0\xfau(\x88\x89/I\xb9[zNP3>\xaa\xd6\x8c\xe9\xf7=\xb4\x0b\xad#\xa2\x95,'
//var hex = new Buffer(long, "hex").toString();

var string = new Buffer(long, "hex");

console.log(string);

var hash = crypto.createHash("md5");
hash.update(string);
console.log(hash.digest("hex"));

function md5HexDigest(data)
{
  var string = new Buffer(data, "hex");
  var hash = crypto.createHash("md5");
  hash.update(string);
  return hash.digest("hex");  
}

//console.log(hex);


//console.log(md5(hex));

//var string = hex;

var string = "ä";
var foo = new Buffer("ä").toString("hex");

console.log(foo);
console.log(md5("\\x84"));



exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.upload = function(req, res) {
  console.log(req.files.FILENAME.path);
fs.createReadStream(req.files.FILENAME.path)
  .pipe(tar.Extract({ path: __dirname + "/extract" }))
  .on("error", function (er) {
    console.error("error here")
  })
  .on("end", function () {
    console.error("done")
  })
  console.log("LET ME UPLOAD!");
  
};

exports.soap = function(req, res) {  
  //api.eye.fi:80
  //StartSession
  //GetCardSettings
  //?:59278
  //StartSession
  //GetPhotoStatus
  //MarkLastPhotoInRoll


  switch(req.headers.soapaction.substr(5, req.headers.soapaction.length-6)) {
    case "StartSession":
      console.log("startsession");
      //console.log(req.params);
      var body = '';
      var parsedbody = '';
        req.on('data', function (data) {
            body += data;
            //console.log(data);
        });
        req.on('end', function () {

            var POST = qs.stringify(qs.parse(body));
            POST = decodeURIComponent(POST);
            // use POST
            console.log(decodeURIComponent(POST));
            parser.parseString(POST, function(err, data) {
              var obj = data["SOAP-ENV:Body"]["ns1:StartSession"];
              var credential = md5HexDigest(obj.macaddress + obj.cnonce + config.cards[obj.macaddress].uploadkey);
              console.log(credential);
              console.log(obj);
              console.log(obj.transfermodetimestamp);
              res.send('<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Body><StartSessionResponse xmlns="http://localhost/api/soap/eyefilm"><credential>'+credential+'</credential><snonce>d7eda40e374e8a34ee97554ebbfea0b5</snonce><transfermode>2</transfermode><transfermodetimestamp>' + obj.transfermodetimestamp + '</transfermodetimestamp><upsyncallowed>false</upsyncallowed></StartSessionResponse></SOAP-ENV:Body></SOAP-ENV:Envelope>');

            });
            
        });


      break;
    case "GetPhotoStatus":
      console.log("GetPhotoStatus");
      var body = '';
      var parsedbody = '';
        req.on('data', function (data) {
            body += data;
            //console.log(data);
        });
        req.on('end', function () {

            var POST = qs.stringify(qs.parse(body));
            POST = decodeURIComponent(POST);
            // use POST
            console.log(decodeURIComponent(POST));
            parser.parseString(POST, function(err, data) {
              var obj = data["SOAP-ENV:Body"]["ns1:GetPhotoStatus"];
              var credential = md5HexDigest(obj.macaddress + config.cards[obj.macaddress].uploadkey + "d7eda40e374e8a34ee97554ebbfea0b5");
              console.log(credential);
              console.log(obj.credential);
              res.send('<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Body><GetPhotoStatusResponse xmlns="http://localhost/api/soap/eyefilm"><fileid>1</fileid><offset>0</offset></GetPhotoStatusResponse></SOAP-ENV:Body></SOAP-ENV:Envelope>');

            });
            
        });
      break;
    case "MarkLastPhotoInRoll":
      console.log("MarkLastPhotoInRoll");
      break;
    default:
      console.log("Different request", req.headers);
      var length = req.headers.soapaction.length;
      console.log(length-2);
      console.log(req.headers.soapaction.substr(5, req.headers.soapaction.length-6));
      break;
  }
};