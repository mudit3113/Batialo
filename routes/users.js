const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

const friendsController = require('../controllers/friends_controller')

router.get('/profile/:id', usersController.profile);

router.get('/profile/friends/toggle-friendship', friendsController.toggleFriendship);

router.post('/update/:id', usersController.update );

router.get('/details', usersController.details);

router.get('/signup', usersController.signup);

router.get('/signin', usersController.signin);

router.post('/create', usersController.create);

//use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/signin'}
),usersController.createSession);

router.get('/signout', usersController.destroySession);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/signin'}), usersController.createSession);

module.exports = router;