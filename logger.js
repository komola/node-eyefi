exports.init = function() {
  var Logger = require('devnull');
  exports.logger = new Logger({ base: true });
};
