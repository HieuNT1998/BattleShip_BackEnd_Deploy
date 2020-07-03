const { Pool, Client } = require("pg");
// var connectionString = "postgres://postgres:123@localhost:5432/BattleShip";
var connectionString = "postgres://xomkroolbhzapo:3e72b69723095a2444742e9eb2e51eaaed37c12bdcd1d06e1e36790277b6809a@ec2-34-194-198-176.compute-1.amazonaws.com:5432/d1k28m2g68cauf";
var pool = new Pool({
    connectionString: connectionString,
})

class User {
    createNew(user, callback) {
        var { email, password, name, avatarUrl } = user
        pool.query(`insert into USERS (EMAIL, PASSWORD, NAME, AVARTAR_URL)  values ('${email}', ${password}, '${name}', '${avatarUrl}')`,
            (err, data) => {
                if (err) callback(err, data)
                else callback(err, data)
            })
    }
    getAll(callback){
        pool.query(`select * from USERS`,
            (err, data) => {
                if (err) callback(err, data)
                else callback(err, data)
            })
    }
    getById(id, callback) {
        pool.query(`select * from USERS WHERE ID = ${id}`,
            (err, data) => {
                if (err) callback(err, data)
                else callback(err, data)
            })
    }
    getByEmail(email, callback) {
        pool.query(`select * from USERS WHERE EMAIL = '${email}'`,
            (err, data) => {
                if (err) callback(err, data)
                else callback(err, data)
            })
    }
    updateById(id, infor, callback) {
        var { password, name, avartar_url } = infor
        pool.query(`update users 
        set password = '${password}', name = '${name}', avartar_url = '${avartar_url}'
        where id = ${id}
        `, (err, data) => {
            if (err) callback(err, data)
            else callback(err, data)
        })
    }
    deleteById(id,callback) {
        pool.query(`delete from users 
              where id = ${id}`, (err, data) => {
            if (!err) callback(err,data)
            else callback(err,data)
        })
    }
}
module.exports =  User;