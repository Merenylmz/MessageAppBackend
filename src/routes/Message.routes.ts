import express from "express";
import { getMessages, sendMessage } from "../controllers/Message.controller";
const router = express.Router();

router.post("/", sendMessage);
router.get("/:receiverId", getMessages);


export default router;
