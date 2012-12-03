
util = require "util"
exec  = require('child_process').exec
multiparter = require "multiparter"
http = require "http"
mime = require "mime"
url = require "url"


class EyefiConfig
    constructor: (config) ->
        @_cards = {};
        for mac, card of config.cards
            card.mac = mac
            @_cards[mac] = new EyefiCardConfig(card, config);
        
    
    getCardConfig: (mac) =>
        @_cards[mac]
        
        
class EyefiCardConfig
    constructor: (config, parentConfig) ->
        @_config = config
        @_parentConfig = parentConfig
    
    _get: (name) =>
        if @_config[name]? then @_config[name] else @_parentConfig?[name]        
    
    
    getMac: =>
        @_config.mac
    
    getDirectory: =>
        @_get "dir"
    
    getUploadKey: =>
        @_config.uploadkey
    
    
    handleUploadedImage: (file) =>
                
        if (configuredCommand = @_get "command")?
          console.log file
          command = util.format configuredCommand, path.normalize file
          console.log command
          child = exec command, (error, stdout, stderr) ->
            @_logError 'stdout: ' + stdout
            @_logError 'stderr: ' + stderr
            if error?
              @_logError 'exec error: ' + error

        if (configuredPost = @_get "post")?
          settings = url.parse configuredPost
          request = new multiparter.request http,
            host: settings.hostname,
            port: settings.post, 
            path: settings.pathname,
            method: "POST"

          request.addStream 'file', 
            path.basename file,
            mime.lookup file,
            fs.statSync(file).size,
            fs.createReadStream file

          request.send (error, response) ->
            if error
                @_logError error
                
            data = ""

            response.setEncoding "utf8"

            response.on "data", (chunk) ->
                data += chunk

            response.on "end", ->
                @_trace "Data: " + data
         
            response.on "error", (error) ->
                @_logError error

exports.Config = EyefiConfig;