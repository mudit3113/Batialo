const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
    //the user who sent the friend request 
    from_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // to the user who has received this friend request 
    to_user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps: true
})

const Friendship = mongoose.model('Friendship', friendshipSchema);
module.exports = Friendship;