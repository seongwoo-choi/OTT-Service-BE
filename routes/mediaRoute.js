const express = require('express');
const router = express.Router();

const multer = require("multer");

const isAuth = require("../middleware/isAuth")
const mediaController = require('../controller/mediaController');

const storage = multer.memoryStorage(); // 메모리에 파일을 저장한다.

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "video/mp4" || file.mimetype === "video/mov" || file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
};

const upload = multer({  
    storage,
    fileFilter,
    limits: { files: 3 }
})


router.post("/", isAuth, mediaController.videoUpload);

router.post("/upload", isAuth, upload.array("media"), mediaController.upload)

router.post("/episode", isAuth, mediaController.episodeUpload)

module.exports = router