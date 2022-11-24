import mongoose from 'mongoose';

const roomsSchema = new mongoose.Schema({
    roomId: { type: String, default: null },
    users: { type: Array, default: [] },
});

export default mongoose.model('rooms', roomsSchema);