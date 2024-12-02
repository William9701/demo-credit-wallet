import express from "express";
import { WalletController } from "../controllers/WalletController";

const router = express.Router();

router.post("/deposit", WalletController.deposit);
router.post("/withdraw", WalletController.withdraw);
router.post("/transfer", WalletController.transfer);
router.get("/transactions/:userId", WalletController.getTransactions);

export default router;
