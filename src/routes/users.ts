import express from "express";
import { createUser, createLinkToken, exchangePublicToken, loginUser } from "../controllers/userController";

const router = express.Router();

router.post("/users", createUser);
router.post("/login", loginUser);
router.post("/create_link_token", createLinkToken);
router.post("/exchange_public_token",exchangePublicToken);

export default router;
