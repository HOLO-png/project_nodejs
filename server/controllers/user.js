const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEMail = require('./sendMail.js');

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
};

module.exports = user;
