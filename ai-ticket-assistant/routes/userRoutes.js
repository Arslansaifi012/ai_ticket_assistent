
import express from 'express' 
import { authenticate } from '../middlewares/auth.js';
import { signup,login, logout, updateUser, getUser } from '../controllers/userController.js';
const userRouter = express.Router() ;

userRouter.post("/update-user", authenticate,updateUser) ;
userRouter.get("/users", authenticate, getUser) ;

userRouter.post("/signup", signup) ;
userRouter.post("/login", login);
userRouter.post("/logout", logout) ;

export default userRouter ;