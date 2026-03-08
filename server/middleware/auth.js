const jwt =  require('jsonwebtoken');
const messages = require('../constants/messages');  



const authMiddleware = (req, res, next) => {
    // console.log(req.header('Authorization'  ));
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return  res.status(401).json({ message: messages.Unauthorized_access });
    }
    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    }
    catch(error){
        res.status(401).json({ message: messages.Unauthorized_access });
    }

}
module.exports = {authMiddleware};