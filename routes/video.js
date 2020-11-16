const express = require("express");
const router = express.Router();
const path = require('path');
const videoshow = require('videoshow');

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

router.get('/create', function(req, res) {
    res.sendFile(path.join(__dirname + '/../createVideo.html'));
});

router.get('/', function(req, res) {
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

module.exports = router;