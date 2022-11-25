import express from "express";
import { createSessionHandler, refreshAccessTokenHandler } from "../controller/auth.controller";
import { requireUser } from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/auth.schema";

const router = express.Router();

export default router;

router.post(
  "/api/sessions",
  validateResource(createSessionSchema),
  createSessionHandler
);


router.post("/api/sessions/refresh", refreshAccessTokenHandler)