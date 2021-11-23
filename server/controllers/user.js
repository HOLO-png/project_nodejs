const User = require('../models/User.js');
const bcrypt = require('bcrypt');

const user = {
    getUserInfo: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getUsersAllInfo: async (req, res) => {
        try {
            const users = await User.find().select('-password');
            res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    updateUserInfo: async (req, res) => {
        if (req.user.id === req.params.id || req.body.isAdmin) {
            if (req.body.password) {
                try {
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(
                        req.body.password,
                        salt,
                    );
                } catch (err) {
                    return res.status(500).json(err);
                }
            }
            try {
                const user = await User.findByIdAndUpdate(
                    { _id: req.user.id },
                    {
                        $set: req.body,
                    },
                );
                res.status(200).json('Account has been updated');
            } catch (err) {
                return res.status(500).json(err);
            }
        } else {
            return res.status(403).json('You can update only your account!');
        }
    },
    deleteUserInfo: async (req, res) => {
        if (req.user.id !== req.params.id || req.body.isAdmin) {
            try {
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json('Account has been deleted');
            } catch (err) {
                return res.status(500).json(err);
            }
        } else {
            return res.status(403).json('You can delete only your account!');
        }
    },
    getFriendsById: async (req, res) => {
        try {
            const user = await User.findById(req.params.userId);
            const friends = await Promise.all(
                user.followings.map((friendId) => {
                    return User.findById(friendId);
                }),
            );
            let friendList = [];
            friends.map((friend) => {
                const { _id, username, profilePicture } = friend;
                friendList.push({ _id, username, profilePicture });
            });
            res.status(200).json(friendList);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateFollowUser: async (req, res) => {
        if (req.body.userId !== req.params.id) {
            try {
                const user = await User.findById(req.params.id);
                const currentUser = await User.findById(req.body.userId);
                if (!user.followers.includes(req.body.userId)) {
                    await user.updateOne({
                        $push: { followers: req.body.userId },
                    });
                    await currentUser.updateOne({
                        $push: { followings: req.params.id },
                    });
                    res.status(200).json('user has been followed');
                } else {
                    res.status(403).json('you allready follow this user');
                }
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(500).json('you cant follow yourself');
        }
    },
    updateUnfollowUser: async (req, res) => {
        if (req.body.userId !== req.params.id) {
            try {
                const user = await User.findById(req.params.id);
                const currentUser = await User.findById(req.body.userId);
                if (user.followers.includes(req.body.userId)) {
                    await user.updateOne({
                        $pull: { followers: req.body.userId },
                    });
                    await currentUser.updateOne({
                        $pull: { followings: req.params.id },
                    });
                    res.status(200).json('user has been unfollowed');
                } else {
                    res.status(403).json('you dont follow this user');
                }
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(403).json('you cant unfollow yourself');
        }
    },
};


module.exports = user;
