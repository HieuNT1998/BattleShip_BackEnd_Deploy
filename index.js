const express = require('express');
const app = express();
const bodyParse = require('body-parser')
const AuthRouter = require('./router/apiAuth');
const UserRouter = require('./router/apiUser');
const { use } = require('./router/apiAuth');
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", '*');
	res.header('Access-Control-Allow-Credentials', 'true')
	res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
	next();
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + "/tests.html")
})

app.use("/auth", AuthRouter);
app.use("/users", UserRouter);

//++++++++++++++++++++++++++++++++++++++++++++ Socket IO Handle +++++++++++++++++++++++++++++++++++++++++++++++++++

var user_online = []
// status 1: ready to fight
// status 2: wait confirm 
// status 3: wait matching radom
// status 4: in game

function get_index_by_socketId(socketId){
	for(let i=0;i<user_online.length; i++){
		if(user_online[i].socketId == socketId) return i
	}
	return -1
}


io.on('connection', (socket) => {
	console.log("co nguoi ket noi: " + socket.id)
	socket.on('disconnect', () => {
		var index = get_index_by_socketId(socket.id);
		if (index !== -1)
			user_online.splice(index, 1);
	})
	socket.on('logout',()=>{
		var index = get_index_by_socketId(socket.id)
		if (index !== -1)
		user_online.splice(index, 1);
	})

	socket.on('c2s_online_alert', (data) => {
		let index = get_index_by_socketId(socket.id)
		if(index == -1){
			user = {
				socketId: socket.id,
				infor: data,
				status: 1
			}
			user_online.push(user)
		}
	})

	socket.on('c2s_online_list', () => {
		socket.emit('s2c_online_list', user_online)
	})

	socket.on('c2s_thach_dau', (data) => {
		var id = data                  // get socketid from data
		var guest_index = get_index_by_socketId(id)   // set status user		
		var host_index = get_index_by_socketId(socket.id)  // handle request
		console.log('loi moi tu', user_online[host_index], 'to', user_online[guest_index])
		if (guest_index == -1) {
			let message = {
				success: 0,
				content: "User was offline"
			}
			socket.emit('s2c_thach_dau', message)
		}
		else if (user_online[guest_index].status != 1) {
			let message = {
				success: 0,
				content: "User not ready"
			}
			socket.emit('s2c_thach_dau', message)
		}
		else{
			let message = {
				succcess : 1,
				host_socketId: user_online[host_index].socketId,
				guest_socketId: user_online[guest_index].socketId,
				host: user_online[host_index].infor
			}
			user_online[host_index].status = 2
			socket.emit('s2c_thach_dau',message)
			io.to(id).emit('s2c_loi_moi', message)
		}
	})

	socket.on('c2s_huy_moi',(data)=>{
		index = get_index_by_socketId(socket.id)
		user_online[index].status = 1
	})

	socket.on('c2s_phan_hoi', (data) => {
		var status = data.result;                            // get status from data
		var id = data.socketId
																// get socketId host from data
		var guest_index = get_index_by_socketId(socket.id)
		var host_index = get_index_by_socketId(id)

		if (status) {                                       // confirm 
			if (user_online[host_index].status != 2) {        // host not wait
				let message = {
					success: 0,
					content: "host is not wait"
				}
				socket.emit('s2c_phan_hoi', message)
			}
			else {
				let message = {
					success: 1,
					host_socketId : user_online[host_index].socketId,
					guest_socketId : user_online[guest_index].socketId
				}
				user_online[guest_index].status = 4
				user_online[host_index].status = 4 
				io.to(user_online[host_index].socketId).emit('s2c_chap_nhan', message)
				socket.emit("s2c_phan_hoi",message)
			}
		}                                                      
		else if (user_online[host_index].status == 2) {        // not confirm - host still wait
			let message = {
				success: 0,
				content: "guest is not confirm"
			}
			user_online[host_index].status = 1
			io.to(user_online[host_index].socketId).emit('s2c_chap_nhan', message)
		}
	})
})

http.listen(process.env.PORT || 5000, (err) => {
	if (err) console.log(err);
	else console.log("Server Ready on port : 5000");
})