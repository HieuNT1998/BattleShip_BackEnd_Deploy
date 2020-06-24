const express = require('express');
const apiGame = express.Router();
var { Pool, Client } = require("pg");

// var connectionString = "postgres://postgres:123@localhost:5432/BattleShip";
var connectionString = "postgres://xomkroolbhzapo:3e72b69723095a2444742e9eb2e51eaaed37c12bdcd1d06e1e36790277b6809a@ec2-34-194-198-176.compute-1.amazonaws.com:5432/d1k28m2g68cauf";
var pool = new Pool({
    connectionString: connectionString,
})

apiGame.get('/alltime/:userId', (req, res) => {
    var id = req.params.userId;
    pool.query(`select sum (end_time - start_time) from game
                where (user1_id = '${id}' or user2_id = '${id}') and end_time is not null`, (err, data) => {
        if (!err) res.status(201).send({ success: 1, data: data.rows })
        else res.status(500).send({ success: 0, message: "fail" })
    })
})


apiGame.post('/', (req, res) => {
    var { user1Id, user2Id } = req.body()
    pool.query(`insert into game (user1_id, user2_id)  values ('${user1Id}', '${user2Id}');`, (err, data) => {
        if (!err) res.status(201).send({ success: 1, message: "success" })
        else res.status(500).send({ success: 0, message: "fail" })
    })
})

// app.put('/endgame',(req,res)=>{
//     var { user1Id,  }
// })

apiGame.get('/allwin/:userId',(req,res)=>{
    var id = req.params.userId
    console.log("Id = ",id)
    pool.query(`select * from game where winner_id = '${id}'`, (err, data) => {
        if (!err) res.status(201).send({ success: 1, allGame : data.rows })
        else res.status(500).send({ success: 0, message: "fail ???"  })
    })
})

module.exports = apiGame;