import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    story: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    views: {type:Number,
        default:0
    },
    UpdatedAt: {
        type: Date,
        default: Date.now
    },
    type: String,
});

export default mongoose.model('Story', storySchema);