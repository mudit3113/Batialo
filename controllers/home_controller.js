const Post = require('../models/post');

const User = require('../models/user');

const Like = require('../models/like');

const Friendships = require('../models/friendship');

module.exports.home = async function (req, res) {

    try {
        //poppulating the data 
        let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                },
                populate: {
                    path: 'likes'
                }
            }).populate('comments')
            .populate('likes');

        let users = await User.find({})

        return res.render('home', {
            title: "Codeial | home",
            posts: posts,
            all_users: users
        });

    }catch(err){
        console.log('error', err);
        return;
        }
    
            

}

