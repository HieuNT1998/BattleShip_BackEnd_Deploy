const express = require('express');
const app = express();
const bodyParse = require('body-parser')
const AuthRouter = require('./router/apiAuth');
const UserRouter = require('./router/apiUser');
const GameRouter = require('./router/apiGame');
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
// app.use("/games", GameRouter)

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
	// console.log("co nguoi ket noi: " + socket.id)
	socket.on('disconnect', () => {
		// console.log(socket.id + " disconnect")
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

	socket.on('c2s_cancel_thach_dau',(data)=>{
		index = get_index_by_socketId(socket.id)
		if(index !== -1) user_online[index].status = 1
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

	socket.on('c2s_auto_matching',()=>{
		// console.log(socket.id + " auto matching")
		var index = get_index_by_socketId(socket.id)
		if(index !== -1){
			user_online[index].status = 3;
		}
		var waiting_room = []
		waiting_room = user_online.filter((user)=>{
			if(user.status === 3 && user.socketId !== socket.id){
				return user
			}
		})
		if(waiting_room.length === 0){
			// console.log("Chua co ai ")
			let message = {
				success : 0,
				message : "please wait"				
			}
			socket.emit('s2c_auto_matching',message)
		}
		else{
			// console.log("Tim thay phong")
			let message = {
				success : 1,
				enemySocketId　: waiting_room[0].socketId,
				enemyInfor : waiting_room[0].infor,
				turn : false
			}
			socket.emit('s2c_auto_matching',message)
			message = {
				success :1, 
				enemySocketId : socket.id,
				enemyInfor : user_online[index].infor,
				turn : true
			}
			io.to(waiting_room[0].socketId).emit('s2c_auto_matching',message)
			user_online[index].status = 4
			index = get_index_by_socketId(waiting_room[0].socketId)
			user_online[index].status = 4
		}
	})

	socket.on('c2s_cancel_auto_matching',()=>{
		var index = get_index_by_socketId(socket.id)
		if(index !== -1) user_online[index].status = 1
		let message = {
			success : 1,
			content : "huy tran thanh cong"
		}
		socket.emit('s2c_cancel_auto_matching', message)
	})

	socket.on('c2s_play_game',(data)=>{
		// console.log(data.enemySocketId + "play......................" + data.playCommand)
		var user2SocketId = data.enemySocketId
		var index = get_index_by_socketId(user2SocketId)
		var gameCommand = data.playCommand
		if(index === -1){
			// user2 was offline
			console.log("User 2 offline")
			let message = {
				success : 0,
				message : 'User2 was offline'
			}
			socket.emit('s2c_play_game',message)
		}
		else if(user_online[index].status !== 4){
			// user2 out room 
			console.log("User 2 out room")
			let message = {
				success : 1,
				message : 'User2 was outroom'
			}
			socket.emit('s2c_play_game',message)
		}
		else{
			// send to user 2
			let message = {
				success : 1,
				message : 'done',
				gameCommand : gameCommand 
			}
			socket.emit('s2c_play_game',message)
			io.to(user2SocketId).emit('s2c_game_command',gameCommand)
		}
	})

	socket.on('c2s_play_with_bot',()=>{
		let index = get_index_by_socketId(socket.id)
		if(index !== -1) user_online[index].status = 4
	})

	socket.on('c2s_end_game',()=>{
		let index = get_index_by_socketId(socket.id)
		if(index !== -1) user_online[index].status = 1
	})

})

http.listen(process.env.PORT || 5000, (err) => {
	if (err) console.log(err);
	else console.log("Server Ready on port : 5000");
})