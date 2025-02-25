let Parser = require('rss-parser');
let parser = new Parser();
const http = require('http');
const https = require('https');
const fetch = require('node-fetch');
const fs = require('fs');
const { body, validationResult } = require('express-validator');

const path = require('path');

// RSS Feed Form page
exports.index =  function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../retrieveAudio.html'));
};

exports.rss_retrieve_audio_post = [
  // (req, res, next) => {
  //   console.log(req.body);

  //   next();
  // },

  body('rssURL', 'No RSS Feed link provided').trim().isLength({ min: 1 }),

  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      res.sendFile(path.join(__dirname + '/../retrieveAudio.html'));

      return;
    }
    else {
      (async () => {
        console.log(req.body.rssURL);

        let feed = await parser.parseURL(req.body.rssURL);

        console.log("Retrieving audio for: " + feed.title);

        var podcastName = feed.title.replace(/[/\\?.,\-%*:|"<>]/g, '');

        let dir = path.join(__dirname + "/../audio/"+ podcastName);

        if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
        }

        // var firstEp = feed.items[feed.items.length-1];

        var epCount = feed.items.length;

        for (i = 0; i < 1 ; i++) {
          var item = feed.items[i];
          console.log("Downloading episode title: ", item.title, " (URL: ", item.enclosure.url + ")");

          let fileName = item.title.replace(/[/\\?.,\-%*: |"<>]/g, '');

          DownloadEpisode(item.enclosure.url, dir + "/" + fileName + ".mp3");
        };

        // fs.rmdirSync(dir, { recursive: true });
        console.log("All episode downloads completed");
      })();
    }

    res.sendFile(path.join(__dirname + '/../retrieveAudio.html'));
  }
];

function DownloadEpisode(url, localPath) {

  // let size = fs.statSync(url);
  // console.log("Audio File Size: " + size);

  fetch(url)
    .then(res => {
      const dest = fs.createWriteStream(localPath);
      const filesize = res.headers.get('content-length');
      // DB - Delete later, just for quick console logs
      let progress = 0;

      let bytesCopied = 0;
      console.time('Donwloaded episode "' + localPath + '"');

      res.body.on('data', function(buffer){
        bytesCopied+= buffer.length;

        let percentage = ((bytesCopied / filesize) * 100).toFixed(2);

        if (percentage - progress > 5) {
          console.log(percentage + '%') // run once with this and later with this line commented
          progress = percentage;
        }
      });
      res.body.on('end', function(){
        console.timeEnd('Donwloaded episode "' + localPath + '"');
      });
      res.body.pipe(dest);

    })
    .catch(err => console.error(err));
}