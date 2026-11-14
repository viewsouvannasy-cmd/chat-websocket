import { Router } from "express";

import { signin } from "../controllers/auth-controller.js";

const route = Router();

route.post("/signin", signin);

export default route;
