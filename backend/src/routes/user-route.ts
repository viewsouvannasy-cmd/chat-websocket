import { Router } from "express";

import { getUserData } from "../controllers/user-controller.js";

const route = Router();

route.get("/", getUserData);

export default route;
