import { Router } from "express";
import {
  createPToP,
  getP2PList,
  searchUserForP2P,
  sendMessageP2P,
} from "../../controllers/chat/p2p-chat/p2p-chat-controller.js";

const route = Router();

route.get("/", getP2PList);
route.post("/search", searchUserForP2P);
route.post("/", createPToP);

route.post("/:pp_id/send", sendMessageP2P);

export default route;
