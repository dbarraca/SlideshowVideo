// Requiring dependencies
const express = require("express");
var path = require('path');

var video = require('./routes/video.js');

var app = express();

// Root route response
// app.get('/', (req, res) => {
//     res.render('index')
//     console.log("visited root route")
// });

//Homepage Route
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use('/video', video);

// Start Server
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Pod Wuphf app running on port:${port}`);
});

// videoshow(images, videoOptions)
// // .audio('./audio/Audio.m4a')
// .save('video.mp4')
// .on('start', function (command) {
//     console.log("starting app");
//     console.log('ffmpeg process started:', command)
// })
// .on('error', function (err, stdout, stderr) {
//     console.error('Error:', err)
//     console.error('ffmpeg stderr:', stderr)
// })
// .on('end', function (output) {
//     console.error('Video created in:', output)
// })