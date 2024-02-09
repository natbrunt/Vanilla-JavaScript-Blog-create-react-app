const multer = require('multer');
const fs = require('file-system');

//=======================================================================
//==================== ⬇⬇⬇  MULTER SETTINGS ⬇⬇⬇ =========================
//=======================================================================
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'files');
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname);
	}
});
const upload = multer({ storage: storage }).single('file');
//=======================================================================
//==================== ⬇⬇⬇  MULTER SETTINGS END  ⬇⬇⬇ ====================
//=======================================================================
const upload_image = async (req, res) => {
	try {
		upload(req, res, async function(err) {
			if (err instanceof multer.MulterError) {
				return res.status(500).json(err);
				// A Multer error occurred when uploading.
			} else if (err) {
				return res.status(500).json(err);
				// An unknown error occurred when uploading.
			}
			// here we can add filename or path to the DB
			console.log(`these could go to the DB: ${req.file.filename}, ${req.file.path}`);
			return res.status(200).json({ ok: true, file: req.file });
			// Everything went fine.
		});
	} catch (error) {
		console.log('error =====>', error);
	}
};


module.exports = {
	upload_image,
};