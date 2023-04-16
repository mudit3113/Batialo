const User = require("../models/user");
const Friendship = require("../models/friendship");

module.exports.toggleFriendship = async function(req,res){
    try{
        let existingFriendship = await Friendship.findOne({
            from_user : req.user || req.query.id ,
            to_user : req.query.id || req.user 
        });
    
    
        let toUser = await User.findById(req.query.id);
        let fromUser = await User.findById(req.user);
    
        let deleted = false;
     
        if(existingFriendship){
            toUser.friends.pull(existingFriendship._id);
            fromUser.friends.pull(existingFriendship._id);
            toUser.save();
            fromUser.save();
            existingFriendship.deleteOne();
            deleted = true;
        }else{
            let friendship = await Friendship.create({
                to_user : req.query.id,
                from_user : req.user
            });
    
            toUser.friends.push(friendship);
            fromUser.friends.push(friendship);
            toUser.save();
            fromUser.save();
        }
    return res.redirect("/");

    }catch(err){
        console.log("error in toggling friendhip", err);
        return;
    }

    
}