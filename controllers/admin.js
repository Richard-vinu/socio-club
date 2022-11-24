import Competition from "../models/competitions.js";
import Stories from "../models/stories.js";
import dotenv from 'dotenv';
dotenv.config();
const adminId = process.env.ADMIN_ID;
// competition Algos

// get competition by upvotes
export const getCompetitionsbyUpvotes = async (req, res) => {
    try {
        const competitions = await Competition.find({}).sort({ upVotes: 1 });
        res.status(200).json(competitions);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

// feature a competition
export const featureCompetition = async (req, res) => {
    const { id } = req.params;
    const { vote } = req.body;
    try {
        let competition = await Competition.findOne({ _id: id });
        competition.upVotes=0
        let newVote = competition.upVotes + vote
        console.log(newVote)
        competition.upVotes = newVote
        await competition.save();
        res.status(200).json({
            message: 'Competition Featured!',
            Competition: competition
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

// get ranks
export const ranks = async (req, res) => {
    const { id } = req.params;
    try {
        const competition = await Competition.findOne({ _id: id });
        let entries = competition.entries;
        entries = entries.sort((a, b) => a.likes > b.likes ? -1 : 1);
        res.status(200).json(entries);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

// create all user stories
export const adminStory = async (req, res) => {
    const {id:storyId}=req.params
    try {
        const existingStory = await Stories.findOne({ author: adminId });
        existingStory.views = existingStory.views + 1;
        await Stories.findByIdAndUpdate(storyId, existingStory, { new: true });
        res.status(200).json({
            message: 'Story viewed'
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const getAdminCompetitions = async(req, res) => {
    try {
        const competitions = await Competition.find({ author: adminId }).sort({ startDate: -1 });
        res.status(200).json(competitions);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};