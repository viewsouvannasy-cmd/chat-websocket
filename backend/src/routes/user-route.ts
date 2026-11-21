import { Router } from "express";

import { getUserData, searchUser } from "../controllers/user-controller.js";

const route = Router();

route.get("/", getUserData);
route.post("/search", searchUser);

export default route;
