const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

const postsCtrl = {
    getPost: async (req, res) => {
        const userId = req.query.userId;
        const username = req.query.username;
        try {
            const user = userId
                ? await User.findById(userId)
                : await User.findOne({ username: username });
            const { password, updatedAt, ...other } = user._doc;
            res.status(200).json(other);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    createPost: async (req, res) => {
        const newPost = new Post(req.body);
        try {
            const savedPost = await newPost.save();
            res.status(200).json(savedPost);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updatePost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (post.userId === req.body.userId) {
                await post.updateOne({ $set: req.body });
                res.status(200).json('the post has been updated');
            } else {
                res.status(403).json('you can update only your post');
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deletePost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (post.userId === req.body.userId) {
                await post.deleteOne();
                res.status(200).json('the post has been deleted');
            } else {
                res.status(403).json('you can delete only your post');
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },
    likeAndDislike: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (!post.likes.includes(req.body.userId)) {
                await post.updateOne({ $push: { likes: req.body.userId } });
                res.status(200).json('The post has been liked');
            } else {
                await post.updateOne({ $pull: { likes: req.body.userId } });
                res.status(200).json('The post has been disliked');
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getPostItemById: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            res.status(200).json(post);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getTimelinePosts: async (req, res) => {
        try {
            const currentUser = await User.findById(req.params.userId);
            const userPosts = await Post.find({ userId: currentUser._id });
            const friendPosts = await Promise.all(
                currentUser.followings.map((friendId) => {
                    return Post.find({ userId: friendId });
                }),
            );
            res.status(200).json(userPosts.concat(...friendPosts));
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getUsersAllPosts: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.params.username });
            const posts = await Post.find({ userId: user._id });
            res.status(200).json(posts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

module.exports = postsCtrl;
