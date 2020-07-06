const jwtHelper = require("../helpers/jwt.helper");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example-nthieu"

let isAuth = async (req, res, next) => {
    const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
    if(tokenFromClient) {
        try{
            const decode = await jwtHelper.verifyToken(tokenFromClient,accessTokenSecret);
            req.jwtDecode = decode;
            next();
        }
        catch(err){
            return res.status(401).send({success:0,message: "Unauthorized."})
        }
    }
    else{
        return res.status(403).send({success:1, message: "No token provided."})
    }
}

module.exports={
    isAuth : isAuth
}