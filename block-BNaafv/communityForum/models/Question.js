var mongoose = require('mongoose');
var slugger = require('slugger');

var Schema = mongoose.Schema;

var questionSchema = new Schema({
    title:{type:String,required:true},
    description:String,
    author:{type:Schema.Types.ObjectId,ref:"Profile"},
    tags:[String],
    answers:[{type:Schema.Types.ObjectId,ref:"Answer"}],
    slug:{type:String},
    upvoteCount:Number,
    upvotedBy:[{type:Schema.Types.ObjectId,ref:'Profile'}],
    comments:[{type:Schema.Types.ObjectId,ref:"Comment"}]

},{timestamps:true})

questionSchema.pre('save',function(next){
    this.slug = slugger(this.title);
    next();
})

var Question = mongoose.model('Question',questionSchema);
module.exports = Question;