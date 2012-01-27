var qs = require("querystring"),
    libxmljs = require("libxmljs");

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.upload = function(req, res) {
  console.log(req.headers);
  res.send("asfd");
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
        req.on('data', function (data) {
            body += data;
            //console.log(data);
        });
        req.on('end', function () {

            var POST = qs.parse(body);
            // use POST
            parser.write(POST).close;
            
        });


      break;
    case "GetPhotoStatus":
      console.log("GetPhotoStatus");
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