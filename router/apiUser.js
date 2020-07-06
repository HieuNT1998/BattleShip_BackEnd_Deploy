const express = require('express');
const apiUser = express.Router();
const userController = require('../controllers/userController')

apiUser.post("/", (req,res)=>{userController.create(req,res)})        // create new user
apiUser.get('/', (req,res)=>{userController.index(req,res)});         // get all user
apiUser.get('/:id', (req,res)=>{userController.show(req,res)});       // get user by id 
apiUser.put('/:id', (req,res)=>{userController.show(req,res)})        // update user by id
apiUser.delete('/:id', (req,res)=>{userController.detroy(req,res)})   // delete user by id

module.exports = apiUser;