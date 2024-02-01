const express     = require('express'),
    router        = express.Router(),
    controller    = require('../controllers/adminController.js');

//findAllReturn 
router.post('/findAll', controller.findAllReturn);

//addUser
router.post('/addAdmin', controller.addAdmin)

//removeUser

//login
router.post('/adminLogin', controller.adminLogin)

//verifyToken

router.post('/verifyToken', controller.verifyToken)

module.exports = router;