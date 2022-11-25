import express from "express";
import { createSessionHandler } from "../controller/auth.controller";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/auth.schema";

const router = express.Router();

export default router;

router.post(
  "/api/sessions",
  validateResource(createSessionSchema),
  createSessionHandler
);
