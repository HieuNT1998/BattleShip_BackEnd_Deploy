  const express = require('express');
  const apiAuth = express.Router();
  var {Pool,Client} = require("pg");
  
  var connectionString = "postgres://xomkroolbhzapo:3e72b69723095a2444742e9eb2e51eaaed37c12bdcd1d06e1e36790277b6809a@ec2-34-194-198-176.compute-1.amazonaws.com:5432/d1k28m2g68cauf";
  var pool = new Pool({
    connectionString:  connectionString,
  })

  // login ---------------
  apiAuth.post('/login', (req, res) => {
    console.log("login")
    var {email, password} = req.body;
    pool.query(`select * from USERS where EMAIL = '${email}' and PASSWORD ='${password}'`,
        (err,data)=>{
            if(err) res.status(500).send({success:0,err})
            else{
                console.log("query success")
                if(data.rows.length > 0 ){
                    console.log("success");
                    res.status(201).send({success:1,userName : data.rows[0]})
                }
                else{
                    res.status(500).send({success:0, error:'ten dang nhap hoac mat khau ko dung'})
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