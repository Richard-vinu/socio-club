import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender: String,
    message: String,
    type: String,
    body: String,
    fileName: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default messageSchema;