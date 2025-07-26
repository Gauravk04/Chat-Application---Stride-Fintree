import express from "express";
import { createGroup } from "../controllers/group.controller.js";

const router = express.Router();

router.post("/groups", createGroup);

export default router;