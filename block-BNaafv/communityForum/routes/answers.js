var express = require('express');
var mongoose = require('mongoose');
var auth = require('../middlewares/auth');
var Answer = require('../models/Answer');
var Question = require('../models/Question');
var User = require('../models/User');
var Comment = require('../models/Comment');
var Profile = require('../models/Profile');

var router = express.Router()

// update answer
router.put('/:answerid',auth.verifyToken, async(req,res,next) => {
    var answerId = req.params.answerId;
    var loggedUser = req.user;
    try {
        var answer = await Answer.findById(answerId).populate('author');
        if(loggedUser.username = answer.author.username){
            var updatedAnswer = await Answer.findByIdAndUpdate(answerId,req.body);
            return res.json({updatedAnswer});
        } else{
            return res.json({error : "you are not authorise to update this answer"})
        }
    } catch (error) {
        next(error);
    }
})

// delete answer

router.delete('/:answerId', auth.verifyToken, async (req,res,next) => {
    var answerId = req.params.answerId;
    var loggedUser = req.user;
    try {
        var answer = await Answer.findById(answerId).populate('author');
        if(loggedUser.username === answer.author.username){
            var deletedAnswer = Answer.findByIdAndDelete(answerId);
            var updatedQuestion = await Question.findByIdAndUpdate(
               deletedAnswer.questionId, {$pull: {answers: deletedAnswer.id}} 
            )

            var updatedUser = await User.findByIdAndUpdate({username:loggedUser.username},{$pull:{answer:deletedAnswer.id}});
            return res.json({answer: deletedAnswer.id})
        } else{
            return res.json({error: "only owner can delete"})
        }
    } catch (error) {
        next(error);
    }
})

//comment on answers
router.post('/comment/:answerId',auth.verifyToken,async (req,res,next) => {
    var answerId = req.params.id;
    var loggedProfile = req.user;

    try {
        var profile = await Profile.findOne({username:loggedProfile.username});
        req.body.author = profile.id;
        req.body.answerId = answerId;

        var comment  = await Comment.create(req.body);
         var updatedAnswer = await Answer.findByIdAndUpdate(answerId,{$push : {comments: comment.id}})

         var updatedProfile = await Profile.findByIdAndUpdate(profile.id, { $push: {comments:comment.id}});
         return res.json({comment: comment});
    } catch (error) {
        
    }
})


// upvote answer 
router.post("/addupvote/:answerId",auth.verifyToken, async (req,res,next) => {
    var answerId = req.params.answerId;
    var profile = req.user;

    try {
         var profile = await Profile.findOne({username:loggedProfile.username});
          var updatedAnswer = await Answer.findByIdAndUpdate(answerId, {$inc : {$upvoteCount: 1}}, {$push:{upvotedBy: profile.id}})

         var updatedProfile = await Profile.findByIdAndUpdate(profile.id,{$push:{upvoteAnswer: updatedAnswer.id}});
         return res.json({answer:updatedAnswer.id});
    } catch (error) {
        next(error);
    }
})

// remove upvote
router.post("/removeupvote/:answerId",auth.verifyToken, async (req,res,next) => {
    var profile = req.user;
    var answerId = req.params.answerId;

    try {
        var profile = await Profile.findOne({username: profile.username});
        var updatedAnswer = await Profile.findByIdAndUpdate(answerId, {$inc: {upvoteCount:-1}}, {$push: {upvotedBy: profile.id}})

        var updatedProfile = await Profile.findByIdAndUpdate(profile.id, {$push: {upvotedanswer: updatedAnswer.id}})
    } catch (error) {
        next(error);
    }

})


module.exports = router;
