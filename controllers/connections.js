import User from "../models/user.js";

export const addConnection = async(req, res) => {
    const { id: userId } = req.params;
    try {
        const userWant = await User.findOne({ _id: userId });
        const existingUser = await User.findOne({ _id: req.user.id });
        const newConnection = existingUser.connections.filter(obj => {
            return (JSON.stringify(obj.userId) === JSON.stringify(userId));
        });
        // console.log(existingUser.connections.includes({ userId: userId }));
        console.log(newConnection);
        if (newConnection.length == 0) {
            existingUser.connections.push({
                userId: userWant._id,
                username: userWant.username,
                name: userWant.name
            });
            existingUser.followers = existingUser.connections.length;
            await User.findByIdAndUpdate(req.user.id, existingUser, { new: true });
            res.status(200).json({
                message: 'User added to connections!',
                User: existingUser
            });
        } else {
            return res.status(201).send("User already a connection!");
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const removeConnection = async(req, res) => {
    const { id: userId } = req.params;
    try {
        const existingUser = await User.findOne({ _id: req.user.id });
        existingUser.connections = existingUser.connections.filter(obj => {
            // console.log(JSON.stringify(obj.userId) !== JSON.stringify(userId));
            return (JSON.stringify(obj.userId) !== JSON.stringify(userId));
        });
        if (existingUser.followers == existingUser.connections.length) {
            return res.status(400).json('Connection Already removed!');
        }
        existingUser.followers = existingUser.connections.length;
        await User.findByIdAndUpdate(req.user.id, existingUser, { new: true });
        res.status(200).json({
            message: 'User removed from connections',
            User: existingUser
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};