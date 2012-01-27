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
			folder: '/usr/images/all', // optional
			command: 'cat %1', // optional
		},

		'0045sdadfersd23' : {
			mac: '0045sdadfersd23', // required
			uploadkey: 'c686e547e3728c63a8fasd729c1592757', // required
		},
	},

	// If you need help finding a bug just turn on debugging.
	debug: true // true or false
};