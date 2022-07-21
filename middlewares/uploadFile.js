const path = require("path");
const multer = require("multer");

// ? ../ для поднятия на уровень выше
const tempDirectory = path.join(__dirname, "../temp"); 

const multerConfig = multer.diskStorage({
    destination: tempDirectory,
    filename: (req, file, cd) => {
        cd(null, file.originalname);
    },
    limits: {
        fileSize: 100
    }
});

const upload = multer({
    storage: multerConfig
});


module.exports = upload;