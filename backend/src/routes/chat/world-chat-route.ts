import { Router } from "express";

import {
  getWorldChat,
  sendWorldChat,
} from "../../controllers/chat/world-chat/world-chat-controller.js";

const route = Router();

route.get("/", getWorldChat);
route.post("/", sendWorldChat);

export default route;
