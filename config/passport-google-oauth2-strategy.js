const passport = require('passport');

const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const crypto = require('crypto');

const User = require('../models/user');

//tell passport to use a new strategy for google login 
passport.use(new googleStrategy({
    clientID: "421760750818-j0n8t936pap7r06didqhvp8qm00qrfea.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL:"http://localhost:8000/users/auth/google/callback"

},

async function(accessToken, refreshToken, profile, done){
    try{
        let user = await User.findOne({email: profile.emails[0].value})
        if(user){
            // if found, set this user as req.user 
            return done(null,user)
        }else{
            // if not found, create the user and set it as req.user 
            await User.create({
                name: profile.displayName,
                email:profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            })          
                return done(null,user);     
        }
    }catch(err){       
            console.log('error in google strategy-passport', err); 
            return;
    }  
        // console.log(profile);  
    }))

module.exports = passport;



            
           