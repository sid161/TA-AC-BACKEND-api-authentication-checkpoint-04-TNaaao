
var express = require('express');
const auth = require('../middlewares/auth');
var Profile = require('../models/Profile');


var User = require('../models/User');

var router = express.Router();

// register

router.post('/register', async (req,res,next) => {
  try {
    var user = await User.create(req.body);
    res.json({user})
  } catch (error) {
    next(error);
  }
})

// login 

router.post("/login", async (req,res,next) => {
  var {email , password} = req.body;
  try {
    if(!email || !password){
      return res.status(400).json({error: "email/password required"})
    }

    var user = await User.findOne({email});

    if(!user){
      return res.status(400).json({error: "User not found"})
    }

    var result = await user.verifyPassword(password);
    if(!result){
      return res.json({error: "Password is wrong"})
    }

    var token = await user.signToken();
    user = await user.userJSON(token);
    res.json({user});
  } catch (error) {
    next(error);
  }
})

// get current-user

router.get('/current-user',auth.verifyToken, async (req,res,next) => {
  var payload = req.user;
  var token = req.header.authorization;
  try {
    var user = await User.findOne({username:payload.username});
    res.json({user:await user.userJSON(token)});
  } catch (error) {
    
  }
})

// follow user
router.get('/follow/:userId', auth.verifyToken, async(req,res,next) => {
  var userId = req.params.userId;
  var loggedProfile = req.user;

  try {
    var loggedUser = await  User.findOne({username:loggedProfile.username});
    if(userId === loggedUser.id){
      return res.json({error: "you cannot follow urself"})
    } else {
      var updatedFollowUser = await User.findByIdAndUpdate(loggedUser.id, {$push: {followers: loggedUser.id}});

      var updatedUser = await User.findByIdAndUpdate(loggedUser.id,{$push: {following:userId}})
    }

    return res.json({updatedFollowUser, updatedUser});
    
  } catch (error) {
    next(error);
  }
})

// 8unfollow user
router.get("/unfollow/:userId", async (req,res,next) => {
  var userId = req.params.userId;
  var loggedProfile = req.user;

  try {
    var loggedUser = User.findOne({username:loggedProfile.username});
    if(userId = loggedUser.id){
      return res.json({error: "you cannot unfollow urself"})
    } else {
      var updatedUnfollowUser = User.findByIdAndUpdate(loggedUser.id, {$pull :{followers: loggedUser.id}})
      var updatedUser = User.findByIdAndUpdate(loggedUser.id, {$pull: {following:userId}})
      return res.json({updatedUser,updatedUnfollowUser});
    }
  } catch (error) {
    next(error);
  }
})

// block userby admin
router.get("/block/:username", auth.isAdmin, async (req,res,next) => {
  var username = req.params.username;
  try {
    var updatedUser = await User.findOneAndUpdate({username:username},{isBlocked:true});

    var updatedProfile = await User.findOneAndUpdate({username}, {isBlocked:true});

    return res.json({updatedProfile});
  } catch (error) {
    next(error);
  }
})

router.get("/block/:username", auth.isAdmin, async (req,res,next) => {
  var username = req.params.username;
  try {
    var updatedUser = await User.findOneAndUpdate({username:username},{isBlocked:false});

    var updatedProfile = await User.findOneAndUpdate({username}, {isBlocked:false});

    return res.json({updatedProfile});
  } catch (error) {
    next(error);
  }
})

// router.get("/track/:questionId", async(req,res,next) => {
//   var questionId = req.params.userId;
//   try {
    
//   } catch (error) {
    
//   }
// })



module.exports = router;
