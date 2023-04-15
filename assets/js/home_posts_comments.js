// implementation via classes 
// this class would be initialised for every post on the page 
class PostComments{
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            let self = this;
            self.deleteComment($(this));
        })
    }

    // method to submit the comment form data for new comment using AJAX 
     createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function (event) {
            event.preventDefault();

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function (data) {
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));

                    new ToggleLike($(' .toggle-like-button', newComment));
                    new Noty
                        ({
                            theme: 'relax',
                            text: 'comment published on post using AJAX',
                            type: 'success',
                            layout: 'topRight',
                            timeout: 1500
                        }).show();
                },
                error: function (error) {
                    console.log(error.responseText);
                }

            })
        })
    }


    newCommentDom(comment) {
        // Change:: show the count of zero likes on this comment
        return $(`<li id="comment-${comment._id}" >
        <p>
            <small>
                <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
            </small>
                ${comment.content}
            <small>
                ${comment.user.name}
            </small>
            <br>
            <small>
                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                                    0 Likes
                </a>
            </small>
        </p>
    </li>`)
    }

    deleteComment(deleteLink) {
        $(deleteLink).click(function (event) {
            event.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#comment-${data.data.comment_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted using AJAX",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            })
        })
    }

}
