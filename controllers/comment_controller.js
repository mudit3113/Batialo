const Comment = require('../models/comment');
const User = require('../models/user')
const commentsMailer = require('../mailers/comments_mailer');



const Post = require('../models/post');
const Like = require('../models/like');



module.exports.create = async function (req, res) {
    try {
        let post = await Post.findById(req.body.post);
        if (post) {
            let comment = await Comment.create
                (
                    {
                        content: req.body.content,
                        post: req.body.post,
                        user: req.user._id
                    }
                )

            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email').execPopulate();
            
            commentsMailer.newComment(comment);


            if(req.xhr){
                return res.status(200).json(
                    {
                        data:{
                            comment: comment
                        },
                        message:"Comment created"
                    }
                )
            }        
            req.flash('success', "comment is added to the post without AJAX")
            res.redirect('/');
        }
    } catch (err) {
        req.flash('error', err)
        return res.redirect('/');
        ;
    }

}

module.exports.destroy = async function (req, res) {
    try {
        let comment = await Comment.findById(req.params.id)
        let post = await Post.findById(comment.post);

        if (comment.user == req.user.id || post.user == req.user.id) {
            let postId = comment.post;
            comment.deleteOne();
                
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id:req.params.id
                    },
                    message: "comment deleted"
                })
            }
            req.flash('success', "comment has been deleted")
            let post = await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } })
            return res.redirect('back');
        } else {
            req.flash("error", "you are not authorised to deleted the comment ")
            return res.redirect('back');
        }
    } catch (err) {
        req.flash("error", err);
        return;
    }



}