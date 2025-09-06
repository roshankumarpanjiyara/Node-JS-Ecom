const multer = require('multer');

const storageConfig = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/uploads/categories/images');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-category-' + file.originalname);
    }
});

const upload = multer({ storage: storageConfig });

const configuredMulterStorage = upload.single('image');

module.exports = configuredMulterStorage;

