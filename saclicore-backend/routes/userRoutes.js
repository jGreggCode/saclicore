import express from "express";
import {
  loginUser,
  registerUser,
  registerUserInfo,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

// User Routes
userRouter.post("/register", registerUser);
userRouter.post("/register-user-info", authUser, registerUserInfo);
userRouter.post("/login", loginUser);

// Admin Routes
// userRouter.post("/admin", adminLogin);
// userRouter.post("/admin-register", adminRegister);

export default userRouter;
