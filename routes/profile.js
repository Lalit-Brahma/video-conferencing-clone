// const router = require('express').Router();

// const authCheck = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         console.log('yo');
//         next();
//     } else {
//         console.log('nahi hua');
//         res.redirect('/auth/login')
//     }
// };

// router.get('/', authCheck, (req, res) => {
//     res.render('profile', { user: req.user });
// });

// module.exports = router;

const passport = require('passport');
const express = require('express');
const {ensureAuth, ensureGuest} = require('../middleware/auth');
const router = express.Router();

router.get('/', ensureAuth, (req, res) =>{
    res.render('profile', { user: req.user });
});


module.exports = router;