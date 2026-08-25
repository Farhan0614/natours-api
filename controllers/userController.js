import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { deleteOne, getAll, getOne, updateOne } from './handlerFactory.js';
import multer from 'multer';
import sharp from 'sharp';

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.originalname.split('.').pop();
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  const isMimeTypeImage = file.mimetype.startsWith('image');
  const isExtensionImage = file.originalname.match(/\.(jpg|jpeg|png|gif)$/i);

  if (isMimeTypeImage || isExtensionImage) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload images only.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single('photo');
export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  // 1. If no image was uploaded, skip to the next middleware
  if (!req.file) return next();

  // 2. Because we used memoryStorage, Multer DID NOT set a filename for us.
  // We have to set it manually on the req.file object so updateMe can save it to MongoDB.
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // 3. Image Processing Magic using Sharp!
  await sharp(req.file.buffer)
    .resize(500, 500) // Crops into a perfect square from the center
    .toFormat('jpeg') // Converts everything (PNGs, GIFs) to JPEG
    .jpeg({ quality: 90 }) // Compresses the image slightly to save space
    .toFile(`public/img/users/${req.file.filename}`); // Writes it to your disk

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const updateMe = catchAsync(async (req, res, next) => {
  // send error if user post password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400,
      ),
    );
  }

  // filtered out unwanted fields name that are not allowed to update
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined. Please use /signup to create user.',
  });
};

export const getAllUsers = getAll(User);
export const getUser = getOne(User);
// do not update password with that (because safe middleware does not run on update)
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
