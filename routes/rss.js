const express = require("express");
const router = express.Router();

var rss_controller = require('../controllers/rssController');

// RSS Feed Form page
router.get('/', rss_controller.index);

router.post('/', rss_controller.rss_retrieve_audio_post);

module.exports = router;