import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import crypto from 'crypto';
import GridFsStorage from 'multer-gridfs-storage';
import { protect } from './middleware/authMiddleware.js';
import User from './models/user.js';

const router = express.Router();

const conn = mongoose.createConnection(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

let gfs;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'uploads' });
});

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

// @desc    function to delete image
export const deleteImage = async (filename) => {
  const image = await gfs.find({ filename: filename }).toArray();
  if (image.length > 0) await gfs.delete(image[0]._id);
};

// @desc    Upload user profile image
// @route   POST /api/images/upload
// @access  Private
router.post(
  '/upload',
  protect,
  upload.single('img'),
  async (req, res, next) => {
    try {
      const profilePicture = `${process.env.SERVER_URL}/api/images/${req.file.filename}`;
      const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: { profilePicture } }
      );
      if (user.profilePicture !== null) {
        await deleteImage(user.profilePicture.split('images/')[1]);
      }

      res.status(201).send({
        image: `${profilePicture}?v=${new Date().getTime()}`,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

// @desc    Upload background image for project
// @route   POST /api/images/upload/projectBgUpload/:projectId
// @access  Private
router.post(
  '/upload/projectBgUpload/:projectId',
  protect,
  upload.single('img'),
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      const projectBg = user.projectsThemes[req.params.projectId].background;
      // if first letter is equal to "l" then it's not a image but linear bg color
      if (projectBg && !projectBg.startsWith('linear')) {
        const prevBgId = projectBg.split('images/')[1];
        await deleteImage(prevBgId);
      }
      const newImageLink = `${process.env.SERVER_URL}/api/images/${req.file.filename}`;
      user.projectsThemes[req.params.projectId].background = newImageLink;
      await user.updateOne(user);
      res.status(201).send({
        image: newImageLink,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

// @desc    Get image
// @route   GET /api/images/:filename
// @access  Public
router.get('/:filename', async (req, res) => {
  console.log('here');
  await gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    console.log('here');
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'no files exist',
      });
    }
    gfs.openDownloadStreamByName(req.params.filename).pipe(res);
  });
});

export default router;
