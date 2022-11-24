import mongoose from 'mongoose';
import Like from './like.js';

const competitionSchema = new mongoose.Schema({
    entries: [{
        UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        User: String,
        post: {
            type: String,
            required: [true, "Please enter a valid post"],
        },
        caption: String,
        likeByWho: [Like],
        likes: {
            type:Number,
            required:true
        },
    }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    upVotes: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date //'2002-12-09' format
    },
    description: String,
    topic: String,
    Status: {
        type: String,
        default: "Open"
    },
    image: String,
    limit: Number
});

export default mongoose.model('Competition', competitionSchema);