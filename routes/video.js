const express = require("express");
const router = express.Router();

var video_controller = require('../controllers/videoController');

router.get('/', video_controller.video_get);

router.get('/create', video_controller.video_create_get);

router.post('/create',  video_controller.video_get);

module.exports = router;