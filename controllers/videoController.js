const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const videoshow = require('videoshow');

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var images = ['./images/image.png'];

var videoOptions = {
    fps: 25,
    loop: 300, // seconds
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

// Video Form page
exports.index =  function(req, res) {
    res.sendFile(path.join(__dirname + '/../createVideo.html'));
};


exports.video_get = function(req, res) {
    videoshow(images, videoOptions)
    .audio(' https://traffic.megaphone.fm/GLT7023135335.mp3')
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


/*
var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', cpUpload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
})
*/

function getExtension(filename) {
    let filenameArr = filename.split(".");

    return filenameArr[filenameArr.length - 1];
}

function renameUpload(input, req) {
    console.log("--- Renaming" + input + "Upload ---");
    console.log("Path: " + req.files[input][0].path);
    console.log("Originalname: " + req.files[input][0].originalname);
    console.log("Extension: " + getExtension(req.files[input][0].originalname));

    var Path = req.files[input][0].path + getExtension(req.files[input][0].originalname);

    fs.rename(req.files[input][0].path, Path, (err) => {
        if (err) throw err;
        console.log(input + ' rename complete!');
    });

    return Path;
}

//Handle deafult video create on POST with audio and image
exports.video_create_post = 
[
    upload.fields(
        [
            { name: 'image', maxCount: 1 }, 
            { name: 'audio', maxCount: 1 }
        ]
    ),
    function (req, res, next) {
        // req.file is the `audio` file
        // req.body will hold the text fields, if there were any

        var backgroundImage = [renameUpload('image', req)];

        videoshow(backgroundImage, videoOptions)
        .audio(renameUpload('audio', req))
        .save('./videos/' + req.body.videoFilename + '.mp4')
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
];


// Handle default video create on POST with image
/*
exports.video_create_post = [upload.single('image'), function (req, res, next) {
    // req.file is the `audio` file
    // req.body will hold the text fields, if there were any

    var ImagePath = req.file.destination + req.file.filename + '.png';

    fs.rename(req.file.destination + req.file.filename, ImagePath, (err) => {
        if (err) throw err;
        console.log('Rename complete!');
    });

    // req.file.filename = 'uploadedImage.jpg';

    // res.send(req.file.destination + req.file.filename);

    // await sharp(req.file.buffer)
    //     .toFormat('jpeg')
    //     .toFile(req.file.destination + req.file.filename);

    var backgroundImage = [ImagePath];

    videoshow(backgroundImage, videoOptions)
    .audio('./audio/Audio.m4a')
    .save('./videos/' + req.body.videoFilename + '.mp4')
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
}];
*/

/*
var cpUpload = upload.fields([{ name: 'videoFilename', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', cpUpload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
})
*/

// No file uploads
/*
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
*/