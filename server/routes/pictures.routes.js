const router = require('express').Router();
const controller = require('../controllers/picturesController.js');

router.delete('/remove/:_id', controller.remove);

module.exports = router;