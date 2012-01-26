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


  switch(req.headers) {
    case "StartSession":
      console.log("startsession");
    case "GetPhotoStatus":
      console.log("GetPhotoStatus");
    case "MarkLastPhotoInRoll":
      console.log("MarkLastPhotoInRoll");
    default:
      console.log("asdf");
  }
};