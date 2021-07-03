var mongoose = require('mongoose');
var Profile = require('../models/Profile');
var Answer = require('../models/Answer');
var Question = require('../models/Question');

var  Schema = mongoose.Schema;

var commentSchema = new Schema({
    text:{type:String,require:true},
    author:{type:Schema.Types.ObjectId,ref:'Profile'},
    answerId :{type:Schema.Types.ObjectId,ref:"Answer"},
    questionId:{type:Schema.Types.ObjectId,ref:"Question"}
},{timestamps:true})

var Comment = mongoose.model('Comment',commentSchema);
module.exports = Comment;