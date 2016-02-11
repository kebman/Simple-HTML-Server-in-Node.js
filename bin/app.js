/*
*	Test Server
*	…that can receive and handle POST requests
*	…and serve some dynamic data
*	…now just add more features (both on the server or the client), and you have something presentable! :D
*/
const express = require('express');
const app = express();

const hostname = '127.0.0.1';
const port = 1338;

const bodyparse = require('body-parser');
app.use(bodyparse.urlencoded({ extended: false }));

// serve static HTML files from /:
app.use(express.static('files'));

// logger (all requests goes through this route):
app.use(function (req, res, next) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log(ip, req.method, req.url);
	next(); // pass the request onto the other routes
});

// fix time format :p
function toJSONLocal (date) {
    var local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, -5);
}

// offer some dynamic (time) data to GET requests using AJAX
app.get('/output', function (req, res) {
	res.header("Content-Type", "text/plain");
	var timestamp = toJSONLocal(new Date());
	// var timestamp = new Date().toISOString()+"ulu time"; // ZULU time
	// var timestamp = Date.now().toString(); // cuz send() only accepts strings
	// var timestamp = (new Date()).getTime().toString(); // same thing…
	// var timestamp = new Date; // same thing…
	res.status(200).send(timestamp);
});

// react to POST requests:
app.post('/', function (req, res, next) {
	console.log(req.body);
	res.header("Content-Type", "text/plain");
	res.send("Data Received: "+"\""+req.body.formValue+"\""); // gives "Error: Can't set headers after they are sent." but still works. :p
	next(); // sends output to next similar function–in this case the 404 func…
});

// 404 message:
// catches anything that isn't caught by the other routes
app.get('*', function (req, res) {
	res.redirect('/404.html');
	res.status(404).end('404 Not Found');
	console.log('404 Not Found');
});

// start server a.k.a. start listening:
app.listen(port, hostname, () => {
	console.log("Server running at http://"+hostname+":"+port+"/");
});
