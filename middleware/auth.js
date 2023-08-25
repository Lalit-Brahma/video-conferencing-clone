module.exports = {
    ensureAuth: (req, res, next) => {
        if(req.isAuthenticated()){
            console.log('authenticated');
            return next();
        } else{
            console.log('not auth')
            return res.redirect('/log/login');
        }
    },

    ensureGuest: (req, res, next) => {
        if(req.isAuthenticated()){
            console.log('auth')
            return res.redirect('/newMeeting');
        } else{
            console.log('not auth')
            next();
        }
    },
}