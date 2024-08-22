const jwt = require('jsonwebtoken') ;

const authMiddleware = (req, res, next) => {
    
    try {
        if (!req.headers.authorization) {
            res.status(401).json({ "status" : "fail", "message": "Not athorized" })
            return;
        }
        // console.log(req.headers.authorization);
        const token = req.headers.authorization.split(" ")[1]
        
        
        if (!token) {
            res.status(401).json({ "status" : "fail", "message": "Not athorized" })
            return;
        }
        const decoded = jwt.verify(token, process.env.TOKEN);
       
        req.role = decoded.role;
        
        next();
    } catch (error) {
        res.status(401).json({ "status" : "fail", "message": "Not athorized" })
        return;
    }
}

module.exports= authMiddleware;