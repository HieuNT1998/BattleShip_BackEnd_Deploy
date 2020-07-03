const { Pool, Client } = require("pg");
// var connectionString = "postgres://postgres:123@localhost:5432/BattleShip";
var connectionString = "postgres://xomkroolbhzapo:3e72b69723095a2444742e9eb2e51eaaed37c12bdcd1d06e1e36790277b6809a@ec2-34-194-198-176.compute-1.amazonaws.com:5432/d1k28m2g68cauf";
var pool = new Pool({
    connectionString: connectionString,
})

class Game{
    getAllTimeOfUser(userId,callback){
        pool.query(`select sum (end_tiem - start_time) from game
        where (user1_id = '${userId}' or user2_id = '${userId}') and end_tiem is not null`,(err,data)=>{
            callback(err,data)
        })
    }
    getAllGameOfUser(userId,callback){
        pool.query(`select * from game where (user1_id = '${userId}' or user2_id = '${userId}') and end_tiem is not null`,()=>{
            callback(err,data)
        })
    }
}

module.exports = Game
