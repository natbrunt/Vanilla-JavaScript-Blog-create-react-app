const express     = require('express'),
    router        = express.Router(),
    controller    = require('../controllers/postsController.js');

//findAllReturn 
router.post('/findAll', controller.findAllReturn);

//add
router.post('/addPost', controller.addPost);

//findPostById
router.post('/findPostById', controller.findOnePostById);

//updatePostById
router.post('/updatePostById', controller.updatePost);

//removePost
router.post('/removePost', controller.removePost);


module.exports = router;