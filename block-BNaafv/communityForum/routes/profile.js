var express = require('express');
const auth = require('../middlewares/auth');
const Profile = require('../models/Profile');
var router = express.Router();

var User = require('../models/User');

router.get("/:username",auth.verifyToken, async(req,res,next) => {
    var postUsername = req.params.username;
    try {
        var profile = await Profile.findOne({username:postUsername});
        if(!profile){
            return res.json({error: "invalid username/ usernmae not found"})
        }
      res.json({profile: await profile.profileJSON()})
    } catch (error) {
        next(error);
    }
})

router.put('/:username', auth.verifyToken, async (req, res, next) => {
    var username = req.params.username;
  
    try {
      var updatedprofile = await Profile.findOneAndUpdate(
        { username: username },
        req.body
      );
  
      let updatedUser = await User.findOneAndUpdate(
        { username: username },
        req.body
      );
  
      res.json({ profile: await updatedprofile.profileJSON() });
    } catch (error) {
      next(error);
    }
  });
  



module.exports = router;