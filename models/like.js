import mongoose from 'mongoose';

const likeSchema = mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    User: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default likeSchema;