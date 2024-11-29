import express from "express";
import { createUser, createLinkToken } from "../controllers/userController";

const router = express.Router();

router.post("/users", createUser);
router.post("/create_link_token", createLinkToken);

export default router;
