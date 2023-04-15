{
    //method to submit the form data for new post using AJAX 
    let createPost =  function(){
        let newPostForm = $('#new-post-form');
        
        newPostForm.submit(function(event){
            event.preventDefault();

            $.ajax({
                type:'post',
                url:'/posts/create',
                data: newPostForm.serialize(), //converts the form data into json
                success: function(data){
                    let newPost = newPostDom(data.data.post)
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                    new Noty
                    ({
                        theme: 'relax',
                        text: 'Post published using AJAX',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error: function(error){
                    console.log(error.responseText);
                }
            })
        })
    }

    //method to create post in DOM 
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
        <p>
            <small>
                <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
            </small>
            ${ post.content }
            <br>
            <small>
            ${ post.user.name }
            </small>
            <br>
            <small>
                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                     0 Likes
                 </a>
            </small>
           
            <div class="post-comments">
                <div class="post-comments-list">
                    <ul id="post-comments-${ post._id }">
                    
                    </ul>
                </div>
    
                    <form id="post-${ post._id }-comments-form" action="/comments/create" method="POST">
                        <input type="text" name="content" placeholder="Write a comment..." required>
                        <input type="hidden" name="post" value="${ post._id }">
                        <input type="submit" value="Comment">
                    </form>
            </div>
        </p>
    </li>`)
    }

     // method to delete a post from DOM
     let deletePost = function(deleteLink)
     {
         $(deleteLink).click(function(event)
         {
             event.preventDefault();
 
             $.ajax({
                 type: 'get',
                 url: $(deleteLink).prop('href'),
                 success: function(data)
                 {
                     $(`#post-${data.data.post_id}`).remove();
                     new Noty
                     ({
                         theme: 'relax',
                         text: 'Post Deleted using AJAX',
                         type: 'success',
                         layout: 'topRight',
                         timeout: 1500
                     }).show();
                 },
                 error: function(error)
                 {
                     console.log(error.responseText);
                 }
             });
         });
     }

//for converting the already existing posts' delete button to AJAX 
     let convertPostsToAjax = function()
     {

        $('#posts-list-container>ul>li').each(function()
        {
            let self = $(this);
            let deleteButton = $(' .delete-post-button',self)
            deletePost(deleteButton);
        })

     }


    createPost();
    convertPostsToAjax();

}