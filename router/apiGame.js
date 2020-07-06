const express = require('express');
const apiGame = express.Router();
const gameController = require('../controllers/gameController')



apiGame.get('/alltime/:userId', (req,res)=>{gameController.allTime(req,res)})
apiGame.get('/allgame/:userId',(req,res)=>{gameController.allGame(req,res)})

module.exports = apiGame;