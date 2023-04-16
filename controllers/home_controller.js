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

        let user;
        if (req.user) {
            user = await User.findById(req.user._id)
            .populate({
              path: "friends",
              populate: {
                path: "from_user",
              },
            })
            .populate({
              path: "friends",
              populate: {
                path: "to_user",
              },
            });
        }

        return res.render('home', {
            title: "Codeial | home",
            posts: posts,
            all_users: users,
            user: user
        });

    }catch(err){
        console.log('error', err);
        return;
        }
    
            

}

