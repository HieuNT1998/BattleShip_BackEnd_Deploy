const express = require('express');
const apiUser = express.Router();
const UserModel = require('../models/User')
var User = new UserModel

// create new user
apiUser.post("/", (req, res) => {
  var { email, password, name, avatarUrl } = req.body;
  if (!avatarUrl) avatarUrl = "https://image.flaticon.com/icons/svg/2919/2919600.svg";
  var newUser = {
    email,
    password,
    name,
    avartar_url,
  }
  User.createNew(newUser,(err, data) => {
      if (err) res.status(500).send({ success: 0, err })
      else {
        res.status(201).send({ success: 1, userName: data.rows[0] })
      }
    })
})

// get all user
apiUser.get('/', (req, res) => {
  User.getAll((err, data) => {
      if (err) res.status(500).send({ success: 0, err })
      else res.status(201).send({ success: 1, userName: data.rows })
    })
});

// get user by id 
apiUser.get('/:id', (req, res) => {
  id = req.params.id
  User.getById(id,(err, data) => {
      if (err) res.status(500).send({ success: 0, err })
      else {
        res.status(201).send({ success: 1, userName: data.rows })
      }
    })
});

// apdate user by id
apiUser.put('/:id', (req, res) => {
  var id = req.params.id;
  var { password, name, avartar_url } = req.body
  var newInfor = {
    password,
    name, 
    avartar_url
  }
  User.updateById(id,newInfor,(err, data) => {
      if (err) res.status(500).send({ success: 0, err })
      else {
        res.status(201).send({ success: 1, message: "success" })
      }
    })
  }
)

// delete user by id
apiUser.delete('/:id', (req, res) => {
  var id = req.params.id;
  User.deleteById(id,(err, data) => {
    if (!err) res.status(201).send({ success: 1, message: "success" })
    else res.status(500).send({ success: 0, message: "delete fail" })
  })

})

module.exports = apiUser;