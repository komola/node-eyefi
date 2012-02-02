module.exports = {
	// This is the location the pictures will be put by default. The 
	// location can either be a relative or absolute path.
	folder: './pictures/', //required

	// All cards should be listed here.
	cards: {
		// This is the Mac Address which can be found in the Settings.xml
		'00185642b77d':{
			// This is the UploadKey as found in the Settings.xml
			uploadkey: '50333eaad68ce9f73db40bad23a2952c', // required
			folder: './pics/', // optional
			//command: 'cat %s', // optional
		},

		'00185650f586' : {
			uploadkey: 'f3bc423f3bda7247e0807e844baebdcc', // required
		},
	},

	// If you need help finding a bug just turn on debugging.
	debug: true // true or false
};