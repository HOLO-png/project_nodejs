const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const postsCtrl = require('../controllers/postsCtrl.js');

//get post user
router.get('/get-post/', postsCtrl.getPost);

//create a post
router.post('/', postsCtrl.createPost);

//update a post
router.put('/:id', postsCtrl.updatePost);

//delete a post
router.delete('/:id', postsCtrl.deletePost);

//like / dislike a post
router.put('/:id/like', postsCtrl.likeAndDislike);

//get a post
router.get('/:id', postsCtrl.getPostItemById);

//get timeline posts
router.get('/timeline/:userId', postsCtrl.getTimelinePosts);

//get user's all posts
router.get('/profile/:username', postsCtrl.getUsersAllPosts);

module.exports = router;