const express = require('express');
const apiAuth = express.Router();
const authController = require('../controllers/authController')

// login ---------------
apiAuth.post('/login',(req,res)=>{authController.login(req,res)});

// logout -------------- 
apiAuth.get('/logout', (req, res) => {
  console.log("logout")
});
// check login
apiAuth.get('/login/check', (req, res) => {
  console.log("da login")
})

module.exports = apiAuth;