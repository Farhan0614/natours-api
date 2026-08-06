import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users,
    },
  });
});

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

export const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not implemented yet.',
  });
};

export const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not implemented yet.',
  });
};

export const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not implemented yet.',
  });
};

export const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not implemented yet.',
  });
};
