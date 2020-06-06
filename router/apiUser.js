const express = require('express');
const apiUser = express.Router();
var {Pool,Client} = require("pg");
  
var connectionString = "postgres://postgres:123@localhost:5432/BattleShip";
var pool = new Pool({
  connectionString:  connectionString,
})

// create new user
apiUser.post("/",(req,res)=>{
  var {email, password, name, avatarUrl} = req.body;
  if(!avatarUrl) avatarUrl = "https://image.flaticon.com/icons/svg/2919/2919600.svg";
  pool.query(`insert into USERS (EMAIL, PASSWORD, NAME, AVARTAR_URL)  values ('${email}', ${password}, '${name}', '${avatarUrl}')`,
    (err,data)=>{
      if(err) res.status(500).send({success:0,err})
      else{
        res.status(201).send({success:1,userName : data.rows[0]})
      }
    })
})

// get all user
apiUser.get('/', (req, res) => {
  pool.query(`select * from USERS`,
    (err,data)=>{
      if(err) res.status(500).send({success:0,err})
      else{
        res.status(201).send({success:1,userName : data.rows})
      }
    })
});

// get user by id 
apiUser.get('/:id', (req, res) => {
  id = req.params.id
  pool.query(`select * from USERS WHERE ID = ${id}`,
  (err,data)=>{
    if(err) res.status(500).send({success:0,err})
    else{
      res.status(201).send({success:1,userName : data.rows})
    }
  })
});

// apdate user by id
apiUser.put('/:id', (req, res) => {
  console.log("update infor")
  id = req.params.id;
  var {password, name, avartar_url} = req.body
  pool.query(`update users 
              set password = '${password}', name = '${name}', avartar_url = '${avartar_url}'
              where id = ${id}
              `,(err,data)=>{
                if(err) res.status(500).send({success:0, err})
                else{
                  res.status(201).send({success:1,message:"success"})
                }
              }) 
})

// delete user by id
apiUser.delete('/:id',(req,res)=>{
  console.log("delete user by id")
  id = req.params.id;
  pool.query(`delete from users 
              where id = ${id}`,(err,data)=>{
                if(!err) res.status(201).send({success:1, message:"success"})
                else res.status(500).send({success:0, message:"delete fail"})
              })

})

module.exports = apiUser;