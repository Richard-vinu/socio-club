import mongoose from 'mongoose';
import Like from './like.js';

const postSchema = new mongoose.Schema({
    post: { type: String, required: true },
    body: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: Number,
    likeByWho: [Like],
    UpdatedAt: {
        type: Date,
        default: Date.now
    },
    Anonymous: {
        type: Boolean,
        default: false
    },
    type: String
});

export default mongoose.model('Post', postSchema);