import mongoose from 'mongoose';
import Like from './like.js';

const commentSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required:true},
    likes: { type: Number },
    likeByWho: [Like],
    UpdatedAt: {
        type: Date,
        default: Date.now
    },
});

export default mongoose.model('Comment', commentSchema);