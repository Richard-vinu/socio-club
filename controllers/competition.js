import Competition from "../models/competitions.js";
export const getCompetitions = async (req, res) => {
    try {
        const competitions = await Competition.find({}).sort({ startDate: -1 });
        res.status(200).json(competitions);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const getCompetitionById = async (req, res) => {
    const { id } = req.params;
    try {
        const competitions = await Competition.findOne({ _id: id });
        res.status(200).json(competitions);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const getCompetitionsOfUsers = async (req, res) => {
    const { id } = req.params;
    try {
        const competitions = await Competition.find({ author: id }).sort({ startDate: -1 });
        res.status(200).json(competitions);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const createCompetition = async (req, res) => {
    const { startDate, endDate, topic, description, image, limit } = req.body;
    try {
        var newCompetition = new Competition({
            author: req.user.id,
            startDate: startDate,
            endDate: endDate,
            topic: topic,
            description: description,
            image: image,
            limit: limit
        });
        await newCompetition.save();
        res.status(201).json(newCompetition);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const updateCompetition = async (req, res) => {
    const { competitionId, endDate, description, status } = req.body;
    Competition.updateOne({ _id: competitionId }, { $set: { endDate: endDate, description: description, status: status } }).exec().then(result => {
        res.status(200).json({
            message: 'Details Updated!',
            Competition: result
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

export const deleteCompetitionById = async (req, res) => {
    const { id } = req.params;
    Competition.deleteOne({ _id: id }).exec().then(result => {
        res.status(200).json({
            message: 'Competition Deleted deleted',
            Competition: result
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

export const submitEntry = async (req, res) => {
    const { post, caption, competitionId, likes } = req.body;
    try {
        const existingCompetition = await Competition.findOne({ _id: competitionId });
        if (existingCompetition.limit > existingCompetition.entries.length) {
            existingCompetition.entries.push({
                UserId: req.user.id,
                User: req.user.name,
                post: post,
                caption: caption,
                likes: likes,
            });
            await Competition.findByIdAndUpdate(competitionId, existingCompetition, { new: true });
            res.status(200).json({
                message: 'Entry Submitted!',
                Post: existingCompetition
            });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const deleteEntry = async (req, res) => {
    const { competitionId, postId } = req.body;
    console.log(postId)
    try {
        const existingCompetition = await Competition.findOne({ _id: competitionId });
        const existingCompetitionFilter = existingCompetition.entries.filter(obj => {

            return obj._id != postId;
        });
        existingCompetition.entries.splice(0, existingCompetition.entries.length, ...existingCompetitionFilter);
        await Competition.findByIdAndUpdate(competitionId, existingCompetition, { new: true });
        res.status(200).json({
            message: 'Entry Removed!',
            Post: existingCompetition
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const entryOfUser = async (req, res) => {
    const { competitionId } = req.params;
    try {
        const existingCompetition = await Competition.findOne({ _id: competitionId });
        const result = existingCompetition.entries.filter(obj => {
            console.log(obj)
            return obj.UserId == req.user.id;
        });
        res.status(200).json({
            message: 'User Entry',
            Post: result
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const likeCompPost = async (req, res) => {
    const { id: competitionId } = req.params;
    const { postId } = req.body
    console.log(postId)
    try {
        const existingPost = await Competition.findOne({ _id: competitionId });
        const index = existingPost.entries.map(data => JSON.stringify(data._id)).indexOf(JSON.stringify(postId))
        existingPost.entries[index].likeByWho.push({
            UserId: req.user.id,
            User: req.user.username,
        });
        let result = existingPost.entries[index].likeByWho.reduce((acc, item) => {
            if (!acc.find(other => JSON.stringify(item.UserId) == JSON.stringify(other.UserId))) {
                acc.push(item);
            }

            return acc;
        }, []);
        existingPost.entries[index].likeByWho.splice(0,existingPost.entries[index].likeByWho.length,...result)
        existingPost.entries[index].likes = existingPost.entries[index].likeByWho.length;
        console.log(existingPost.entries[index].likeByWho.length)
        await Competition.findByIdAndUpdate(competitionId, existingPost, { new: true });
        res.status(200).json({
            message: 'Post Liked',
            Post: existingPost
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const unlikeCompPost = async (req, res) => {
    const { id: competitionId } = req.params;
    const { postId } = req.body
    try {
        const existingPost = await Competition.findOne({ _id: competitionId });
        const index = existingPost.entries.map(data => JSON.stringify(data._id)).indexOf(JSON.stringify(postId))
        // console.log(Competition.entries, "----", existingPost);
        const likesArray=existingPost.entries[index].likeByWho
        likesArray.splice(likesArray.findIndex(i=>JSON.stringify(i.UserId)===JSON.stringify(req.user.id)),1)
        if (existingPost.entries[index].likes == likesArray.length) {
            return res.status(400).json('Already unLiked!');
        }
        existingPost.entries[index].likes = likesArray.length;
        await existingPost.save();
        res.status(200).json({
            message: 'Post Unliked',
            Post: existingPost
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};