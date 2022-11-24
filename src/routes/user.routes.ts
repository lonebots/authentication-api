import express from "express";
import {
  createUserHandler,
  verifyUserHandler,
} from "../controller/user.controller";
import validateResource from "../middleware/validateResource";
import { createUserSchema, verifyUserSchema } from "../schema/user.schema";

const router = express.Router();

// create user
router.post(
  "/api/users",
  validateResource(createUserSchema),
  createUserHandler
);

export default router;

// verify user
router.post(
  "/api/users/verify/:id/:verificationCode",
  validateResource(verifyUserSchema),
  verifyUserHandler
);
