import { Router } from "express";

import {
  createGroupChat,
  getGroupList,
} from "../../controllers/chat/group-chat/group-chat-controller.js";

const route = Router();

route.get("/", getGroupList);
route.post("/", createGroupChat);

export default route;
