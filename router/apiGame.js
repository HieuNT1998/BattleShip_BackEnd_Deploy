const express = require('express');
const apiGame = express.Router();
const GameModel = require('../models/Game');
const Game = new GameModel

apiGame.get('/alltime/:userId', (req, res) => {
    var id = req.params.userId;
    Game.getAllTimeOfUser(id, (err, data) => {
        console.log(err)
        if (!err) res.status(201).send({ success: 1, data: data.rows })
        else res.status(500).send({ success: 0, message: "fail" })
    })
})

apiGame.get('/allgame/:userId',(req,res)=>{
    var id = req.params.userId  
    Game.getAllGameOfUser(id, (err, data) => {
        if (!err) res.status(201).send({ success: 1, allGame : data.rows })
        else res.status(500).send({ success: 0, message: "fail ???"  })
    })
})

module.exports = apiGame;