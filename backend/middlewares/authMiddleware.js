import User from './../models/userModel.js';
import { verifyToken } from './../utils/token.js';

const protect = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = verifyToken(token);
            req.user = await User.findById(decoded._id).select("-password");
            next()
        } catch (error) {
            return res.status(401).send({ success: false, message: "Not authorized, token failed" });
        }
    }

    if(!token){
        return res.status(401).send({ success: false, message: "Not authorized, no token" });
    }
}

export default protect;