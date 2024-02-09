const router = require('express').Router();
const controller = require('../controllers/uploadController.js');

router.post('/submit', controller.upload_image);

module.exports = router;