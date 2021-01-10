// Requiring dependencies
const express = require("express");
var path = require('path');

const bodyParser = require('body-parser');

var videoRouter = require('./routes/video.js');
var rssRouter = require('./routes/rss.js');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Root route response
// app.get('/', (req, res) => {
//     res.render('index')
//     console.log("visited root route")
// });

//Homepage Route
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use('/video', videoRouter);
app.use('/rss', rssRouter);

// Start Server
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Pod Wuphf app running on port:${port}`);
});