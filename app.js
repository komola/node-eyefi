/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , formidable = require("formidable");

var config = require("./config");

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(function(req, res, next){
    if (req.url == '/api/soap/eyefilm/v1/upload') {
      var form = new formidable.IncomingForm();
      console.log("Starting upload");  
      bar = require("progress-bar").create(process.stdout);
      bar.width = 25;
      form.on('progress', function(received, expected) {
        bar.update(received/expected);
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
