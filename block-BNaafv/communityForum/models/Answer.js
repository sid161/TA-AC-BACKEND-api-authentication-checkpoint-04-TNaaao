var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema

var answerSchema = new Schema({
    text:{type:String,require:true},
    author:{type:Schema.Types.ObjectId,ref:"Profile"},
    upvoteCount: {type:Number,default:0},
    upvotedBy:{type:Schema.Types.ObjectId,ref:"Profile"},
    questionId: {type:Schema.Types.ObjectId,ref:'Question'},
    comments:[{type:Schema.Types.ObjectId,ref:"Comment"}]
},{timestamps:true});

var Answer = mongoose.model('Answer',answerSchema)
module.exports = Answer;