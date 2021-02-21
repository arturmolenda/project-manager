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

router.post(
  '/upload',
  protect,
  upload.single('img'),
  async (req, res, next) => {
    try {
      // If user changes image more than once delete previous picture
      const userImage = await gfs
        .find({ filename: req.file.filename })
        .toArray();

      if (userImage.length > 1) await gfs.delete(userImage[0]._id);

      const profilePicture = `${process.env.SERVER_URL}/api/images/${req.file.filename}`;
      await User.updateOne({ _id: req.user.id }, { $set: { profilePicture } });

      res.status(201).send({
        image: `${profilePicture}?v=${new Date().getTime()}`,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.get('/:filename', async (req, res) => {
  await gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'no files exist',
      });
    }
    gfs.openDownloadStreamByName(req.params.filename).pipe(res);
  });
});

export default router;
