const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const Friendships = require('../models/friendship');



module.exports.profile = async function (req,res) {
    try {
        let user = await User.findById(req.params.id);
        
        req.flash('success', "welcome to " + user.name + "'s Profile Page");
        return res.render('users', {
            title: "User profile",
            profile_user: user
        })
    } catch (err) {
        req.flash("error", err);
    }
}

module.exports.update = async function (req, res) {
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err) {console.log('*****Multer Error', err)}
                // console.log(req.file);
                user.name = req.body.name;
                user.email= req.body.email;

                if(req.file){
                    if(user.avatar){
                        let currAvatarPath = path.join(__dirname,'..', user.avatar);
                        if(fs.existsSync(currAvatarPath)){
                            fs.unlinkSync(path.join(__dirname, '..' , user.avatar))
                        }
                    }
                    // this is saving the path of the uploaded file into avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            })

        } catch (err) {
            req.flash("error", err);
            return res.redirect('back');
        }

    } else {
        req.flash("error", err);
        return res.status(401).send('Unauthorised');
    }

}

module.exports.details = function (req, res) {
    return res.render('users', {
        title: "Users"
    });

}

// for rendering the signup page 
module.exports.signup = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "User sign up"
    })
}

//for rendering the signin page
module.exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "User sign in"
    })
}

// get the sign up data 
module.exports.create = function (req, res) {
    if (req.body.password != req.body.password_confirm) {
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email })
        .then(function (user) {
            if (!user) {
                User.create(req.body)
                    .then(function (user) {
                        return res.redirect('/users/signin')
                    })
                    .catch(function (err) {
                        console.log("error in creating user in signing up")
                        return;
                    })

            } else {
                return res.redirect('back');
            }
        })
        .catch(function (err) {
            console.log("error in finding user in signing up")
            return;
        })
}


// sign in and create a session  
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in successfully');
    return res.redirect('/');
}


//for signing out and destroying the session 
module.exports.destroySession = function (req, res) {
    req.logout(req.user, err => {
        if (err) return next(err);
        req.flash('success', 'You have logged out!!')
        return res.redirect("/");
    });
}

