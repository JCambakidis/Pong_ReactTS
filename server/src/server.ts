import express from "express";
import http from "http";
import {Server} from "socket.io";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {cors: {origin: "0.0.0.0"}});

var count : number = 0;
var id : number = 0;
var tabPlayersIndex = new Map<number, string>();
var ball : null = null;

function getIndexOfPlayer(socketId : string) : number 
{
	if (tabPlayersIndex.get(1) === socketId)
		return 1;
	return 2;
}

io.on("connection", (socket) => {
	console.log("client connected : " + socket.id);

    socket.join("pong");

	if (tabPlayersIndex.get(1) === undefined)
		tabPlayersIndex.set(1, socket.id);
	else
		tabPlayersIndex.set(2, socket.id);

	socket.emit('connected', getIndexOfPlayer(socket.id));
	socket.emit('newPlayer', getIndexOfPlayer(socket.id));

	socket.on('dataPlayer', function(id)
	{
		//io.emit('newPlayer', data, id);
		/*if(tabPlayer.length>1)
		{
			for (var i = tabPlayer.length-1; i >= 1; i--) 
		}*/
		//socket.emit('createBall', ball);
	});
	
	socket.on ('refreshPlayer', function (data, id)
	{
		socket.broadcast.emit('updatePlayer', data, id);
	});
	
	socket.on("newBallLocation", function(x, y)
	{
		socket.broadcast.emit('updatePositionBall', x, y);
	})

	socket.on('DataBall', function(data)
	{
		io.emit('createBall', data);
	});
	
	socket.on('getScore', function(score, idShoot)
	{
		console.log(score);
		io.emit('addScore', score, idShoot);
	})

	socket.on('disconnect', function(id)
	{
		console.log("client \"" + socket.id + "\" disconnected from server");
		tabPlayersIndex.delete(getIndexOfPlayer(socket.id));
	});

	socket.on("sendHitPlayer", function(x, y)
	{
		io.emit("receiveHitPlayer", x, y);
	});
	socket.on("sendHitWall", function(x, y)
	{
		io.emit("receiveHitWall", x, y);
	});
	socket.on("sendPlayerScore", function(x, y)
	{
		io.emit("receivePlayerScore", x, y);
	});
	socket.on("sendGameStart", function()
	{
		io.emit("receiveGameStart");
	});
	socket.on("sendGameRestart", function()
	{
		io.emit("receiveGameRestart");
	});
})

server.listen(3000, () => {
	console.log("Server started on port 3000");
})