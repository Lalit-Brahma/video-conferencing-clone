const passport=require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');


passport.use(
    new GoogleStrategy({
        callbackURL: 'http://localhost:3000/auth/google/callback',
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }, 
    async function(accessToken, refreshToken, profile, done) {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                console.log("user is there");
                done(null, user);
            } else {

                const newUser = { 
                    googleId: profile.id,
                    name: profile.displayName,
                    photos: profile.photos[0].value
                };
                user = await User.create(newUser);
                console.log("creating new user");
                done(null, user);
            }
        } catch (err) {
            console.error(err);
        }
    })
);

passport.serializeUser((user, done) => {
    console.log('serialized');
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});