import Stories from "../models/stories.js";

export const getStories = async(req, res) => {
    try {
        const stories = await Stories.find({}).sort({ UpdatedAt: -1 });
        res.status(200).json(stories);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const getStoryById = async(req, res) => {
    const { id } = req.params;
    try {
        const stories = await Stories.findOne({ _id: id });
        res.status(200).json(stories);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const getStoryofUsers = async(req, res) => {
    const { id } = req.params;
    try {
        const stories = await Stories.find({ author: id }).sort({ UpdatedAt: -1 });
        res.status(200).json(stories);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const postStory = async(req, res) => {
    const { story, type } = req.body;
    try {
        var newStory = new Stories({
            author: req.user.id,
            story: story,
            type: type
        });
        await newStory.save();
        res.status(201).json(newStory);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const deleteStoryById = async(req, res) => {
    const { id } = req.params;
    Stories.deleteOne({ _id: id }).exec().then(result => {
        res.status(200).json({
            message: 'Story deleted',
            Story: result
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

export const viewStory = async(req, res) => {
    const { id: storyId } = req.params;
    try {
        const existingStory = await Stories.findOne({ _id: storyId });
        existingStory.views = existingStory.views + 1;
        await Stories.findByIdAndUpdate(storyId, existingStory, { new: true });
        res.status(200).json({
            message: 'Story viewed'
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};