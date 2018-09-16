'use strict';

// Required modules
const busboy = require('connect-busboy'); //middleware for form/file upload
const ipfsAPI = require('ipfs-api');
const express = require('express');
const fs = require('fs-extra');
const path = require('path');     //used for file path

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// Connect to IPFS network via Infura gateway
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

// App
const app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

/*
	Route to show IPFS hash
*/

app.get('/', (req, res) => {
  res.send('File sent to IPFS!\nHash is: ' + req.query.hash);
});


/*
	Route to upload files to
*/

app.route('/upload')
	.post(function (req, res, next) {
		var hash;
		var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);

            ipfs.files.add(file, function (err, file) {
		        if (err) {
		          	console.log(err);
		        } else {
		          	console.log(file[0].hash);
		          	hash = file[0].hash;
		          	res.redirect('/?hash=' + hash)
		        }
	      	})
        });
	})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);