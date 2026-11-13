import { Router } from "express";

import { signin } from "../controllers/auth-controller.js";

const route = Router();

route.get("/signin", signin);

export default route;
