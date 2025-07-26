import express from "express";
import { createGroup } from "../controllers/group.controller.js";
import { sendGroupMessage } from "../controllers/group.mesaage.controller.js";
import { getGroupMessages } from "../controllers/group.mesaage.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/createGroup", protectRoute, createGroup);
router.post("/sendGroupMessage", protectRoute, sendGroupMessage);
router.get("/messages/:groupId", protectRoute, getGroupMessages);


export default router;