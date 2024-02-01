const express     = require('express'),
    router        = express.Router(),
    controller    = require('../controllers/usersController.js');

//findAllReturn 
router.post('/findAll', controller.findAllReturn);

//add
router.post('/addUser', controller.addUser);

//login
router.post('/login', controller.login)

//verifyToken
router.post('/verifyToken', controller.verifyToken)

//removeUser
router.post('/removeUser', controller.removeUser)

//sendEmail
router.post('/sendEmail', controller.sendEmail)

//deleteAccount
router.post('/deleteAccount', controller.deleteAccount)

//updatePassword
router.post('/updatePassword', controller.updatePassword)

//findAllDeletesUsers
router.post('/findAllDeletedUsers', controller.findAllDeletedUsers)

//reactivateUser
router.post('/reactivateUser', controller.reactivateUser)

module.exports = router;