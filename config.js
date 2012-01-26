module.exports = {
	// This is the location the pictures will be put by default. The 
	// location can either be a relative or absolute path.
	folder: './pictures/', //required

	// All cards should be listed here.
	cards: {
		{
			// This is the Mac Address which can be found in the Settings.xml
			{mac: '0045sdasd23'}, // required
			// This is the UploadKey as found in the Settings.xml
			{UploadKey: 'c686e547e3728c63a8f78729c1592757'}, // required
			{folder: '/usr/images/all'}, // optional
			{command: 'cat %1'}, // optional
		},
		{
			{mac: '0045sdadfersd23'}, // required
			{UploadKey: 'c686e547e3728c63a8fasd729c1592757'}, // required
		},
	},

	// If you need help finding a bug just turn on debugging.
	debug: true // true or false
};