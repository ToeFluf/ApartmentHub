const http = require('http');
const child_process = require('child_process');

const PORT = 8080;
const HOST = '0.0.0.0'

const requestHandler = (req,res)=>{

    const { headers, method, url } = req;
    let body = "";
    req.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body+=chunk;
    }).on('end', () => {
	var data = JSON.parse(body);
        var repo = data.repository;
	
        if(method === "POST" && repo.name == "ApartmentHub"){
           	console.log("Running deploy");
		deploy(res);
        }else{
		console.log("request error");
		res.writeHead(500);
		res.end();
	}
	    console.log("Finished");
    });
};

const server = http.createServer(requestHandler);

server.listen(PORT, HOST, ()=>{
	console.log("Listening at " + HOST + " on port " + PORT);
})

function deploy(res){
	child_process.execSync("cd ~/Desktop/ApartmentHub && ./deploy.sh", (err, stdout, sterr)=>{
		console.log("executing deploy.sh");
		if(err){
			console.error(err);
			res.writeHead(500)
			return res.end();
		}
		console.log('stdout: ${stdout}');
		console.log("Successfully ran the script");
		res.writeHead(200);
		res.end();
	});
}
