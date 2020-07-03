  const express = require('express');
  const apiAuth = express.Router();
  var UserModel = require('../models/User');
  var User = new UserModel

  // login ---------------
  apiAuth.post('/login', (req, res) => {
    var {email, password} = req.body;
    console.log(email)
    User.getByEmail(email,
        (err,data)=>{
            if(err) res.status(500).send({success:0,err})
            else{
              var user = data.rows[0]
              if(!user) res.status(500).send({success:0, error:'Email not found'})
              else{
                if(password === user.password) res.status(201).send({success:1,userName : data.rows[0]})
                else res.status(500).send({success:0, error:'Password incorrect'})
              }
            }
        }
    )
  });

  // logout -------------- 
  apiAuth.get('/logout', (req, res) => {
    console.log("logout")
  });

  // check login
  apiAuth.get('/login/check', (req, res) => {
    console.log("da login")
  })

  module.exports = apiAuth;