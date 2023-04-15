const Post = require('../models/post');
const User = require('../models/user');
const Like = require('../models/like');


const Comment = require('../models/comment');
const { request } = require('express');

module.exports.create = async function (req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
                })
        if(req.xhr){
            post = await post.populate(
                'user',
                'name'
            )

            return res.status(200).json({
                data:{
                    post:post   
                },message:"Post Created!"
            })
        }

        req.flash('success', "Post is published")
        return res.redirect('back');
    } catch (err) {
        req.flash('error', err)
        return res.redirect('back');
    }
}

    //controller for deleting the post 
    module.exports.destroy = async function (req, res) {
        try {
            let post = await Post.findById(req.params.id)

            //.id means converting the object id 
            if (post.user == req.user.id) {

                // await Like.deleteMany({likeable: post._id, onModel:'Post'});
                
                post.deleteOne();

                await Comment.deleteMany({ post: req.params.id })


                if(req.xhr){
                    return res.status(200).json({
                        data: {
                            post_id:req.params.id
                        },
                        message: "post deleted"
                    })
                }

                req.flash('success', "Post and associated comments are deleted")
                return res.redirect('back');
            } else {
                req.flash('error', 'you are not authorised to delete post')
                return res.redirect('back');
            }
        } catch (err) {
            req.flash('error', err)
            return res.redirect('back');
        }
    }