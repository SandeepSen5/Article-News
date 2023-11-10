const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const blogController = require('../contollers/bogController');
const verifyToken = require("../middlewares/blogMiddleware");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + Date.now() + ".jpg");
    },
});

const upload = multer({ storage: storage });

router.post('/register', blogController.register)

router.post('/login', blogController.login)

router.get('/logout', blogController.logout)

router.get('/getuserdetails', verifyToken, blogController.getUserDetails)

router.post('/updateuser', verifyToken, blogController.updateUser)

router.post('/updatepassword', verifyToken, blogController.updatePassword)

router.post('/upload', upload.single('photos'), blogController.photoUpload);

router.post('/post', verifyToken, blogController.createPost)

router.get('/getposts', verifyToken, blogController.getPost)

router.get('/singlepost/:id', blogController.getSinglepost)

router.delete('/deletepost/:id', blogController.deletePost)

router.get('/getmyposts/:id', verifyToken, blogController.getMypost)

router.get("/getLikes/:id", verifyToken, blogController.likeMypost)

router.get("/getdisLikes/:id", verifyToken, blogController.dislikePost)

router.get('/getcatpost/:id', blogController.categoryPost)

module.exports = router;




