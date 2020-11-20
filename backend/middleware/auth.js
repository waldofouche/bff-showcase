const jwt = require('jsonwebtoken');

const auth = (req,res, next) => {
    try {
        const token = req.header("x-auth-token");
        // Checks if a jwt token is recieved
        if (!token)
            return res
             .status(401)
             .json({msg: "No authentication token, authorization denied"});
        
        // Checks it token is legit
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified)
            return res
             .status(401)
             .json({msg: "Token verification failed, authorization denied"});
        
        // Verifys current user and grabs id
        req.user = verified.id;

        // Continues to next func
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

module.exports = auth;