import Post from "../models/posts.js";
import Comment from "../models/comment.js";

export const getPosts = async(req, res) => {
    try {
        const posts = await Post.find({}).sort({ UpdatedAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const getComments = async(req, res) => {
    try {
        const comments = await Comment.find({}).sort({ UpdatedAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const getPostById = async(req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findOne({ _id: id });
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const getCommentById = async(req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comment.findOne({ _id: id });
        res.status(200).json(comment);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const getPostComments = async(req, res) => {
    const { id } = req.params;
    try {
        const comments = await Comment.find({ postId: id }).sort({ UpdatedAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const getPostofUsers = async(req, res) => {
    const { id } = req.params;
    try {
        const posts = await Post.find({ author: id }).sort({ UpdatedAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const createPost = async(req, res) => {
    const { post, body, type } = req.body;
    try {
        var newPost = new Post({
            author: req.user.id,
            post: post,
            body: body,
            type: type
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const createComment = async(req, res) => {
    const { postId, comment } = req.body;
    try {
        var newComment = new Comment({
            comment: comment,
            author: req.user.id,
            postId: postId
        });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const updateComment = async(req, res) => {
    const { commentId, comment } = req.body;
    Comment.updateOne({ _id: commentId }, { $set: { comment: comment } }).exec().then(result => {
        res.status(200).json({
            message: 'Comment Updated',
            comment: result
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

export const updatePost = async(req, res) => {
    const { postId, post } = req.body;
    Post.updateOne({ _id: postId }, { $set: { post: post } }).exec().then(result => {
        res.status(200).json({
            message: 'Post Updated',
            Post: result
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

export const deletePostById = async(req, res) => {
    const { id } = req.params;
    Post.deleteOne({ _id: id }).exec().then(result => {
        res.status(200).json({
            message: 'Post deleted',
            Post: result
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

export const deleteCommentById = async(req, res) => {
    const { id } = req.params;
    Comment.deleteOne({ _id: id }).exec().then(result => {
        res.status(200).json({
            message: 'Comment deleted',
            comment: result
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

export const likeComment = async(req, res) => {
    const { id: commentId } = req.params;
    try {
        const existingComment = await Comment.findOne({ _id: commentId });
        existingComment.likeByWho.push({
            UserId: req.user.id,
            User: req.user.username,
        });
        let result = existingComment.likeByWho.reduce((acc, item) => {
            if (!acc.find(other => JSON.stringify(item.UserId) == JSON.stringify(other.UserId))) {
                acc.push(item);
            }

            return acc;
        }, []);
        existingComment.likeByWho.splice(0,existingComment.likeByWho.length,...result)
       existingComment.likes =existingComment.likeByWho.length;
        await Comment.findByIdAndUpdate(commentId, existingComment, { new: true }).then((result)=>{
            res.status(200).json({
                message: 'Comment Liked',
                Comment: result
            });
        })
        
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const likePost = async(req, res) => {
    const { id } = req.params; 
    try {
        const existingPost = await Post.findOne({ _id:id});
       
        existingPost.likeByWho.push({
            UserId: req.user.id,
            User: req.user.username,
        });
        let result = existingPost.likeByWho.reduce((acc, item) => {
            if (!acc.find(other => JSON.stringify(item.UserId) == JSON.stringify(other.UserId))) {
                acc.push(item);
            }

            return acc;
        }, []);
        existingPost.likeByWho.splice(0,existingPost.likeByWho.length,...result)
        existingPost.likes = existingPost.likeByWho.length;
        await Post.findByIdAndUpdate(id, existingPost, { new: true }).then(result => {
            res.status(200).json({
                message: 'Post liked',
                Post: result
            });
        })
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const unlikePost = async(req, res) => {
    const { id: postId } = req.params;
    try {
        const existingPost = await Post.findOne({ _id: postId });
        const likesArray=existingPost.likeByWho
        likesArray.splice(likesArray.findIndex(i=>JSON.stringify(i.UserId)===JSON.stringify(req.user.id)),1)
        if (existingPost.likes == likesArray.length) {
            return res.status(400).json('Already unLiked!');
        }
        existingPost.likes = likesArray.length;
        await existingPost.save().then((result)=>{
            res.status(200).json({
                message: 'Post Unliked',
                Post: result
            });
        }
        );
        
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const unlikeComment = async(req, res) => {
    const { id: postId } = req.params;
    try {
        const existingComment = await Comment.findOne({ _id: postId });
        const likesArray=existingComment.likeByWho
        likesArray.splice(likesArray.findIndex(i=>JSON.stringify(i.UserId)===JSON.stringify(req.user.id)),1)
        if (existingComment.likes == likesArray.length) {
            return res.status(400).json('Already unLiked!');
        }
        existingComment.likes = likesArray.length;
        await existingComment.save().then((result)=>{
            res.status(200).json({
                message: 'Comment Unliked',
                Comment: result
            });
        });
        
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const createAnonymousPost = async(req, res) => {
    try {
        const { post, body, type } = req.body;
        var newPost = new Post({
            author: req.user.id,
            post: post,
            body: body,
            type: type,
            Anonymous: true,
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};

export const getAnonymousPosts = async(req, res) => {
    try {
        const posts = await Post.find( { Anonymous: { "$in": ["true", true] } }).sort( { UpdatedAt: -1 } );
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};