import express from 'express';
import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getUser,
  updateMe,
  updateUser,
} from '../controllers/userController.js';
import {
  forgetPassword,
  login,
  protect,
  resetPassword,
  signUp,
  updatePassword,
} from '../controllers/authController.js';

const userRouter = express.Router();
userRouter.post('/signup', signUp);
userRouter.post('/login', login);
userRouter.post('/forgetPassword', forgetPassword);
userRouter.patch('/resetPassword/:token', resetPassword);

userRouter.patch('/updateMyPassword', protect, updatePassword);

userRouter.patch('/updateMe', protect, updateMe);
userRouter.delete('/deleteMe', protect, deleteMe);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
//push2
