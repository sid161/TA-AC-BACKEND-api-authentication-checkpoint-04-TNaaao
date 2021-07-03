var express = require('express');
const auth = require('../middlewares/auth');
const Question = require('../models/Question');
var _ = require('lodash');
var router = express.Router();

router.get('/', auth.verifyToken, async (req,res,next) => {
    try {
        var questions = Question.find({});
        let arrTags = questions.reduce((acc,cv) => {
            acc.push(cv.tags);
            return acc;
            return res.json({tags:arrTags});
        },[]);

    } catch (error) {
        next(error);
    }
})


module.exports = router;