const { body, validationResult } = require('express-validator');
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
};

exports.video_get = function(req, res) {
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
    });
};

// Handle Video create on POST.
exports.video_create_get =  function(req, res) {
    res.sendFile(path.join(__dirname + '/../createVideo.html'));
};

exports.video_create_post =  [
    // Validate and santise the name field.
    body('videoFilename', 'Video name required').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            console.log("No create video postErrors");
            // res.send('Tried to create video');
            videoshow(images, videoOptions)
            .audio('./audio/Audio.m4a')
            .save('./videos/' + req.body.videoFilename + ".mp4")
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
            });
        }
        else {
            // console.log(errors);
            res.send(errors);
        }
    }
//    res.sendFile(path.join(__dirname + '/../createVideo.html'));
];