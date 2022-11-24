import mongoose from 'mongoose';
import Message from './message.js';

const convSchema = mongoose.Schema({
    roomName: String,
    UpdatedAt: {
        type: Date,
        default: Date.now
    },
    users: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" } }],
    Messages: [Message]
});

const Conversation = mongoose.model('Conversation', convSchema);
export default Conversation;