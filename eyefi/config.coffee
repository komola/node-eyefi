
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
  
  get: (name) =>
    if @_config[name]? then @_config[name] else @_parentConfig?[name]        
  
  
  getMac: =>
    @_config.mac
  
  getDirectory: =>
    @get "dir"
  
  getUploadKey: =>
    @_config.uploadkey




exports.Config = EyefiConfig;