/**
 * @title server.js
 * @authors Reece Mathews and Daniel Schmidt
 * @description Basic Server for Rasp PI for funs stuff
 * */

const http = require('http')
const path = require('path')
const fs = require('fs')
const process = require('process')

const PORT = 3000;
const HOST = '0.0.0.0'

const reqHandler = (req, res)=>{
	console.log(req.url);
	console.log(req.method)
	res.end("Connected");
};

const server = http.createServer(reqHandler);

server.listen(PORT, HOST, function(){
	console.log("Listening at " + HOST + " on port " + 3000);
})
