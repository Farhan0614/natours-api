import express from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from '../controllers/userController.js';
import { login, signUp } from '../controllers/authController.js';

const userRouter = express.Router();
userRouter.post('/signup', signUp);
userRouter.post('/login', login);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
