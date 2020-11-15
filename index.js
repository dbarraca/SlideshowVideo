var videoshow = require('videoshow');

var images = ['image.jpg'];

var videoOptions = {
    fps: 25,
    loop: 5, // seconds
    transition: true,
    transitionDuration: 1, // seconds
    videoBitrate: 1024,
    videoCodec: 'libx264',
    size: '640x?',
    audioBitrate: '128k',
    audioChannels: 2,
    format: 'mp4',
    pixelFormat: 'yuv420p'
}

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