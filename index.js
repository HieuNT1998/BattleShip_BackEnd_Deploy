const express = require('express');
const app = express();
const bodyParse = require('body-parser')
const AuthRouter = require('./router/apiAuth');
const UserRouter = require('./router/apiUser')


app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
    next();
});

app.get('/',(req,res)=>{
    res.send("<h1>HELLO ANH EM </h1>")
})

app.use("/auth",AuthRouter);
app.use("/users",UserRouter);

app.listen(process.env.PORT || 6969, (err) => {
    if (err) console.log(err);
    else console.log("Server Ready on port : 6969");
})