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
        // let feed = await parser.parseURL('http://feeds.serialpodcast.org/serialpodcast');
        // let feed = await parser.parseURL('http://thereadercopypodcast.libsyn.com/rss');
        // let feed = await parser.parseURL('https://feeds.megaphone.fm/replyall');
        
        console.log(req.body.rssURL);

        let feed = await parser.parseURL(req.body.rssURL);

        console.log("Retrieving audio for: " + feed.title);

        var podcastName = feed.title.replace(/[/\\?.,\-%*:|"<>]/g, '');

        // var firstEp = feed.items[feed.items.length-1];

        var epCount = feed.items.length;

        for (i = 0; i < 1 ; i++) {
          var item = feed.items[i];
          console.log("Downloading episode title: ", item.title, " (URL: ", item.enclosure.url + ")");

          var fileName = item.title.replace(/[/\\?.,\-%*: |"<>]/g, '');

          var dir = path.join(__dirname + "/../audio/"+ podcastName);

          if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
          }

          DownloadEpisode(item.enclosure.url, dir + "/" + fileName + ".mp3");
        };

        console.log("All episode downloads completed");
      })();
    }

    res.sendFile(path.join(__dirname + '/../retrieveAudio.html'));
  }
];

function DownloadEpisode(url, localPath) {
  const dest = fs.createWriteStream(localPath);

  fetch(url)
    .then(res => {
      res.body.pipe(dest);
    })
    .catch(err => console.error(err))
    .finally(console.log("Episode finished downloading"));
}