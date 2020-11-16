// Requiring dependencies
const express = require("express");
var path = require('path');
var videoshow = require('videoshow');

var app = express()


var images = ['./images/image.png'];

var videoOptions = {
    fps: 25,
   loop: 10, // seconds
    // transition: true,
    // transitionDuration: , // seconds
    videoBitrate: 1024,
    videoCodec: 'libx264',
    size: '640x?',
    audioBitrate: '128k',
    audioChannels: 2,
    format: 'mp4',
    pixelFormat: 'yuv420p'
}

// Root route response
// app.get('/', (req, res) => {
//     res.render('index')
//     console.log("visited root route")
// });


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/video/create', function(req, res) {
    res.sendFile(path.join(__dirname + '/createVideo.html'));
});

app.get('/video', function(req, res) {
    videoshow(images, videoOptions)
    .audio('./audio/Audio.m4a')
    .save('./videos/video.mp4')
    .on('start', function (command) {
        console.log("starting videoshow");
        console.log('ffmpeg process started:', command)
    })
    .on('error', function (err, stdout, stderr) {
        console.error('Error:', err)
        console.error('ffmpeg stderr:', stderr)
    })
    .on('end', function (output) {
        console.error('Video created in:', output);
        // res.sendFile(path.join(__dirname + '/index.html'));
        res.download(output);
    })
});

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