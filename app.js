/**
 * Module dependencies.
 */
require("./logger").init();
var logger = require('./logger').logger;
logger.use(require('devnull/transports/stream'), {
    stream: require('fs').createWriteStream('loggers.log')
});

logger.log("test");

var express = require('express')
  , routes = require('./routes')
  , formidable = require("formidable");

var config = require("./config");

var app = module.exports = express.createServer();

// Configuration

//var progressBars = {};

app.configure(function(){
  app.use(function(req, res, next){
  	console.log(req.connection.remoteAddress);
    if (req.url == '/api/soap/eyefilm/v1/upload') {
      var form = new formidable.IncomingForm();
      var startTime = new Date();
      var old = 0;
      console.log("Starting upload");  
      //We can't use progressbars because there are two files at the same time.
      form.on('progress', function(received, expected) {
        //console.log(this.requestHeader);
        if(old != Math.round(received*100/expected) && Math.round(received*100/expected) % 10 == 0)
         console.log(Math.round(received*100/expected));
        old = Math.round(received*100/expected)
      });
      form.on('end', function() {
        var timeTaken = (new Date().getTime() - startTime.getTime()) / 1000;
        var kbs = ((req.headers['content-length']/1024)/timeTaken);
        console.log(timeTaken + " - " + kbs + "kb/s");
        console.log(req);
//        logger.log((req.headers['content-length']/1024) + " - "+ timeTaken + " (" + kbs + "kb/s)");
      });
      form.parse(req);
    }
    next();
  });
  app.set('views', __dirname + '/views');
  app.register("html", require('ejs'));
  app.set('view engine', 'html');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.post('/api/soap/eyefilm/v1', routes.soap);
app.post('/api/soap/eyefilm/v1/upload', routes.upload);

app.listen(59278);
console.log("The Node-Eyefi Server was successfully started and is listening.");
