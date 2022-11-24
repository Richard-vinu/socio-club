import User from '../models/user.js';

export const getUsers = async(req, res) => {
    try {
        const users = await User.find().select('name _id email photourl');
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const getUsersBySearch = async(req, res) => {
    const searchQuery = req.query;
    console.log(searchQuery)
    try {
        // const users = await User.find({ $text: { $search: searchQuery } })
        const users = await User.find(searchQuery);
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export var getProfile = async(req, res) => {
    const userProf = await User.findOne({ _id: req.user.id });
    if (userProf) {
        res.status(200).json(userProf);
    } else {
        res.status(404).json("User Not Found");
    };
};