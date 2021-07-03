var express = require('express');
var mongoose = require('mongoose');
var auth = require('../middlewares/auth');
var Answer = require('../models/Answer');
var Question = require('../models/Question');
var User = require('../models/User');
var Comment = require('../models/Comment');
var Profile = require('../models/Profile');


var router = express.Router();

// create question
router.post('/',auth.verifyToken, async (req,res,next) => {
    var loggedUser = req.user;

    try {
        var profile = await Profile.findOne({username:loggedUser.username})
        req.body.author = profile.id;

        var question = Question.create(req.body);

        var updatedUser = await User.findByIdAndUpdate(loggedUser.id, {$push:{questions: question.id}})
        res.json({question});


    } catch (error) {
        next(error);
    }
})

// list questions
router.get('/',async (req,res,next) => {
    var loggedUser = req.user;
     try {
         var questions = await Question.find({});
         return res.json({questions});
     } catch (error) {
        next(error);    
     }
})


// update question
router.put('/:questionId', auth.verifyToken, async (req,res,next) => {
    

    try {
        var loggedUser = req.user;
         var questionId = req.params.questionId;
        var question = await Question.findById(questionId).populate('author');
        if( question.author.username === loggedUser.username){
            var updatedQuestion = await Question.findByIdAndUpdate(questionId, req.body);
            return res.json({question: updatedQuestion});
        } else{
            return res.json({error: "you are not authorises only question creator can do"})
        }

    } catch (error) {
        next(error);
    }
})

// delete question 
router.delete("/:slug", async (req,res,next) => {
    var loggedUser  = req.user;
    var slug = req.params.slug;

    try {
        var deletedquestion = await Question.findOneAndDelete({slug});
        var updatedUser = await User.findOneAndUpdate({username:loggedUser.username}, {$pull: {questions: deletedquestion.id}});
    } catch (error) {
        next(error);
    }
})

// add answer

router.post("/:questionId/answer",auth.verifyToken, async (req,res,next) => {
    var questionId = req.params.questionId;
    var loggedUser = req.user;

    try {
        var profile = await Profile.findOne({username:loggedUser.username});
        req.body.author = profile.id;
        req.body.questionId = questionId;

        var answer = await Answer.create(req.body);
        var updatedQuestion = await Question.findByIdAndUpdate(questionId, {$push: {answers: answer.id}});
        var updatedUser = await User.findOneAndUpdate({username:loggedUser.username}, {$push: {answers: answer.id}});
        return res.json({answer})
    } catch (error) {
        next(error);
    }
})

// list answers

router.get("/:questionId/answers",auth.verifyToken, async (req,res,next) => {
    var questionId = req.params.questionId;
    var loggedUser = req.user;

    try {
        var question = await Question.findById(questionId).populate('answers');

        return res.json({answers: question.answers});
    } catch (error) {
        next(error);
    }
})

// upvote question

router.post("/upvote/:questionId",auth.verifyToken, async (req,res,next) => {
    var loggedUser = req.user;
    var questionId = req.params.questionId;
     try {
         var loggedProfile = await Profile.findOne({username:loggedUser.username});
          var updatedQuestion = await Question.findByIdAndUpdate(questionId, {$inc: {upvote:1}},{$push:{upvotedBy: loggedProfile.id}})
          var updatedProfile = await Profile.findByIdAndUpdate(loggedProfile.id, {$push:{upvotedQuestion: updatedQuestion.id}})
          return res.json({question: updatedQuestion});
     } catch (error) {
         next(error);
     }

})

// remove upvote question

router.post("/removeupvote/:questionId", auth.verifyToken, async(req,res,next) => {
    var loggedUser = req.params.user;
    var questionId = req.params.questionId;

    try {
        var loggedProfile = await Profile.findOne({usernme:loggedUser.username});

        var updatedQuestion = Question.findByIdAndUpdate(questionId, {$inc: {upvvote:-1}})
        var updatedProfile = Profile.findByIdAndUpdate(loggedProfile.id, {$push:{upvotedQuestion: updatedQuestion.id}});
        return res.json({question: updatedQuestion});
    } catch (error) {
        next(error)
    }
})

// create new comment

router.post('/comment/:questionId', auth.verifyToken, async(req,res,next) => {
    var loggedUser = req.user;
    var questionId = req.params.questionId;

    try {
        var profile = await Profile.findOne({username:loggedUser.username});
        req.body.author = profile.id;
        req.body.questionId = questionId;

        var comment = Comment.create(req.body);
        var updatedQuestion = await Question.findByIdAndUpdate(questionId, {$push:{comments:comment.id}});
        var updatedProfile = await Profile.findByIdAndUpdate(profile.id,{$push: {comments:comment.id}});

        return res.json({comment});
    } catch (error) {
        next(error);
    }
})




module.exports = router;