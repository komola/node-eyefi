module.exports =
  #groupId: "prismabox" # optional
  #userId:  "prismabox" # optional


  # This is the location the pictures will be put by default. The 
  # location can either be a relative or absolute path.
  dir: "./pictures/" #required

  # All cards should be listed here.
  cards:
    # This is the Mac Address which can be found in the Settings.xml
    "00185642b77d":
      # This is the UploadKey as found in the Settings.xml
      uploadkey: "50333eaad68ce9f73db40bad23a2952c" # required
      dir: "./pics/" # optional
      #command: "cat %s" # optional

    "00185650f586":
      uploadkey: "f3bc423f3bda7247e0807e844baebdcc"
    "001856519041":
      uploadkey: "2c19819f8a9d9516af55d8f4567a4ce1"
    "0018565114cc":
      uploadkey: "2747df122a872c261e504b0ffc11ed75"

  # Posts the image to a webserver
  postWebrequest: "http://localhost/photos"
