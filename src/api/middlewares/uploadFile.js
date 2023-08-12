const cloudinary = require("cloudinary").v2
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const multer = require("multer")

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: 'avatars',
        allowFormats: ['jpg', 'png', 'jpeg', 'gif']
    },
});

const uploadFile = multer({storage});

module.exports = uploadFile;