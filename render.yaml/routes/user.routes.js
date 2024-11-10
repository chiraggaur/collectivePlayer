"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/User/user.controller");
const supabaseClient_1 = require("../services/supabaseClient");
// import prisma from "../services/prismaClient";
// import authenticateToken from "../middlewares/authMiddleware";
const router = (0, express_1.Router)();
// create new user
router.post("/Signup", user_controller_1.createUser);
// get current user
router.get("/Login", user_controller_1.getUser);
// Signout User
router.get("/Signout", supabaseClient_1.signOut);
// delete User
router.post("/Delete", supabaseClient_1.deleteUser);
exports.default = router;
