var UserModel = require('../models/User');
const { generateToken } = require('../helpers/jwt.helper');
const jwtHelper = require('../helpers/jwt.helper');
const User = new UserModel

let tokenList = {}
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h"
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example-nthieu"
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d"
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "access-token-secret-example-nthieu"

let login = (req,res) =>{
  try {
    var { email, password } = req.body;    
    User.getByEmail(email, async (err, data) => {
        if (err) res.status(500).send({ success: 0, err })
        else {
          var user = data.rows[0]
          if (!user) res.status(500).send({ success: 0, error: 'Email not found' })
          else {
            if (password === user.password){
              const accessToken =  await generateToken(data.rows[0],accessTokenSecret,accessTokenLife)
              const refreshToken = await generateToken(data.rows[0],refreshTokenSecret,refreshTokenLife)
              tokenList[refreshToken] = {accessToken,refreshToken}
              res.status(200).send({ success: 1, userName: data.rows[0], accessToken,refreshToken})
            } 
            else res.status(500).send({ success: 0, error: 'Password incorrect' })
          }
        }
      })
  }
  catch{
    return res.status(500).json(error);
  }
}

let refreshToken = async (req,res)=>{
  const refreshTokenFromClient = req.body.refreshToken;
  if(refreshTokenFromClient && (tokenList[refreshTokenFromClient])){
    try{
      const decode = await jwtHelper.verifyToken(refreshTokenFromClient,refreshTokenSecret);
      const user = decode.data;
      const accessToken = await jwtHelper.generateToken(user,accessTokenSecret,accessTokenLife);
      return res.status(200).json({accessToken})
    }
    catch(err){
      res.status(403).json({message:"Invalid refresh token."})
    }
  }
  else{
    res.status(403).send({message:"no Token provided"})
  }
}

module.exports = {
    login,refreshToken
}