const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentsController = require('../controllers/comment_controller');


router.post('/create', commentsController.create )

router.get('/destroy/:id', commentsController.destroy )

module.exports = router;


