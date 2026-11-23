import { Router } from "express";

import {
  createGroupChat,
  getGroupList,
  deleteGroup,
  addMember,
  sendMessageGroupChat,
  getGroupChat,
} from "../../controllers/chat/group-chat/group-chat-controller.js";

const route = Router();

route.get("/", getGroupList);
route.post("/", createGroupChat);
route.delete("/:group_id", deleteGroup);

route.post("/:group_id/member/add/:user_id_to_member", addMember);

route.get("/:g_id", getGroupChat);
route.post("/:g_id/:gm_id/send", sendMessageGroupChat);

export default route;
