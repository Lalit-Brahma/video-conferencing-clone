const passport=require('passport');
const router = require('express').Router();

// const { ensureAuth, ensureGuest } = require('./auth');


router.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', {failureRedirect: '/login'}),
  (req, res)=> {
    console.log('lol');
    res.redirect('/profile');
  });


router.get('/logout',  (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;