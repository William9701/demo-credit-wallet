import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        email: string;
        account_number: string;
      };
    }
  }
}
