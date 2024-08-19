import express, { Response, Request } from "express";
import { login, register, logout, getUsersForChats } from "../controllers/Auth.controller";
import verifyToken from "../middleware/verifyToken";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/logout", verifyToken, logout);
router.get("/users", verifyToken, getUsersForChats);


export default router;