import mongoose from 'mongoose';

const connectionSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: String,
    name: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default connectionSchema;