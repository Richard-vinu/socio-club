import Conversation from '../models/conversation.js';

export const getConversations = async(req, res) => {
    try {
        const conversations = await Conversation.find({}).sort({ UpdatedAt: -1 });
        res.status(200).json(conversations);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const getMyConversations = async(req, res) => {
    try {
        const conversations = await Conversation.find({ users: { $elemMatch: { user: req.user.id } } }).sort({ UpdatedAt: -1 });
        res.status(200).json(conversations);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const getConversation = async(req, res) => {
    const { id } = req.params;
    try {
        const conversation = await Conversation.find({ _id: id });
        res.status(200).json(conversation);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const deleteConversation = async(req, res) => {
    const { id } = req.params;
    try {
        const conversation = await Conversation.deleteOne({ _id: id });
        res.status(200).json({
            message: 'conversation Deleted!',
            Competition: conversation
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const postMessage = async(req, res) => {
    const { message, type, fileName, body } = req.body;
    const { id: roomId } = req.params;

    const conversation = await Conversation.findById(roomId);
    conversation.Messages.push({
        senderId: req.user.id,
        sender: req.user.name,
        message: message,
        type: type,
        fileName: fileName,
        body: body
    });

    const updatedConversation = await Conversation.findByIdAndUpdate(roomId, conversation, { new: true });

    res.status(200).json(updatedConversation);
};

export const createConversation = async(req, res) => {
    const { roomName, users } = req.body;
    const newConversation = new Conversation({ roomName });
    try {
        for (var i = 0; i < users.length; i++) {
            // console.log(users[i]);
            newConversation.users.push({ user: users[i] });
        }
        await newConversation.save();
        res.status(201).json(newConversation);
    } catch (error) {
        res.status(409).json({ message: error.message });
    };
};