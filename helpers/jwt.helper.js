const jwt = require("jsonwebtoken");

let generateToken = (user,secretSignature, tokenLife)=>{
    return new Promise((resolve, reject)=>{
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email
        }
        jwt.sign(
            {data: userData},
            secretSignature,
            {
                algorithm: "HS256",
                expiresIn: tokenLife,
            },
            (err,token)=>{
                if(err) return reject(err) 
                resolve(token)
            })
    })
}

let verifyToken = (token,secretKey)=>{
    return new Promise ((resolve,reject)=>{
        jwt.verify(token, secretKey, (err,decode)=>{
            if(err) return reject(err)
            resolve(decode)
        })
    })
}

module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken
}
