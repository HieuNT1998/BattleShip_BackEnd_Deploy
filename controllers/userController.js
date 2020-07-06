var UserModel = require('../models/User');
const User = new UserModel

let index = (req, res) => {
    User.getAll((err, data) => {
        if (err) res.status(500).send({ success: 0, err })
        else res.status(201).send({ success: 1, userName: data.rows })
    })
}

let show = (req, res) => {
    id = req.params.id
    User.getById(id, (err, data) => {
        if (err) res.status(500).send({ success: 0, err })
        else {
            res.status(201).send({ success: 1, userName: data.rows })
        }
    })
}

let create = (req, res) => {
    var { email, password, name, avatarUrl } = req.body;
    if (!avatarUrl) avatarUrl = "https://image.flaticon.com/icons/svg/2919/2919600.svg";
    var newUser = {
        email,
        password,
        name,
        avartar_url,
    }
    User.createNew(newUser, (err, data) => {
        if (err) res.status(500).send({ success: 0, err })
        else {
            res.status(201).send({ success: 1, userName: data.rows[0] })
        }
    })
}
let edit = (req, res) => {
    var id = req.params.id;
    var { password, name, avartar_url } = req.body
    var newInfor = {
        password,
        name,
        avartar_url
    }
    User.updateById(id, newInfor, (err, data) => {
        if (err) res.status(500).send({ success: 0, err })
        else {
            res.status(201).send({ success: 1, message: "success" })
        }
    })
}

let detroy = (req, res) => {
    var id = req.params.id;
    User.deleteById(id, (err, data) => {
        if (!err) res.status(201).send({ success: 1, message: "success" })
        else res.status(500).send({ success: 0, message: "delete fail" })
    })
}

module.exports = {
    index, show, create, edit, detroy
}