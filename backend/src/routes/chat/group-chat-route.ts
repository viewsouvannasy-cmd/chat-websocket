import { Router } from "express";

import {
  createGroupChat,
  getGroupList,
  deleteGroup,
  addMember,
} from "../../controllers/chat/group-chat/group-chat-controller.js";

const route = Router();

route.get("/", getGroupList);
route.post("/", createGroupChat);
route.delete("/:group_id", deleteGroup);

route.post("/:group_id/member/add/:user_id_to_member", addMember);

export default route;
