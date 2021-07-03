var jwt = require('jsonwebtoken');

module.exports = {
    verifyToken: async (req,res,next) => {
        var token = req.headers.authorization;
        if(!token){
            return res.json({error: "token required"})
        }
        try {
            var payload = await jwt.verify(token,"thisisasecret");
            req.user = payload;
            next();
        } catch (error) {
            next(error);
        }
    },

    isAdmin: async (req,res,next) => {
        var token = req.headers.authorization;
        if(!token){
            return res.json({error: "token required"})
        }

        try {
           var payload = await jwt.verify(token, "thisisasecret");
           if(!payload.isAdmin){
               return res.status(400).json({error: "you must be an admin to do changes"});
           } 
           req.user = payload;
           next();
        } catch (error) {
            next(error);
        }
    }
}