import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const signin = async(req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username: username });
        if (!existingUser)
            return res.status(404).json({ message: "User doesn't exist." });

        const isPasswordCorrect = await bcryptjs.compare(password, existingUser.password);
        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Invalid credentials." });

        const token = jwt.sign({ name: existingUser.name, email: existingUser.email, id: existingUser._id, photourl: existingUser.photourl, username: existingUser.username, phone: existingUser.phone }, 'test', { expiresIn: "30d" });
        res.status(200).json({ result: existingUser, token: token });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    };
};

export const signup = async(req, res) => {
    const { email, password, confirmPassword, name, phone, photourl, username } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exist." });
        }
        if (password !== confirmPassword)
            return res.status(400).json({ message: "Passwords don't match." });
        const encryptedPassword = await bcryptjs.hash(password, 12);
        const result = await User.create({ email: email, password: encryptedPassword, name: name, phone: phone, photourl: photourl, username: username });
        const token = jwt.sign({ name: result.name, email: result.email, id: result._id, photourl: result.photourl, username: result.username, phone: result.phone }, 'test', { expiresIn: "30d" });
        res.status(200).json({ result: result, token: token });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    };
};

export const otherSignin = async(req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        const token = jwt.sign({ name: existingUser.name, email: existingUser.email, id: existingUser._id, photourl: existingUser.photourl, username: existingUser.username, phone: existingUser.phone }, 'test', { expiresIn: "30d" });
        res.status(200).json({ result: existingUser, token: token });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    };
};

export const otherSignup = async(req, res) => {
    const { email, name, phone, photourl, username } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return otherSignin(req, res);
        }
        const result = await User.create({ email: email, name: name, phone: phone, photourl: photourl, username: username });
        const token = jwt.sign({ name: result.name, email: result.email, id: result._id, photourl: result.photourl, username: result.username, phone: result.phone }, 'test', { expiresIn: "30d" });
        res.status(200).json({ result: result, token: token });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    };
};