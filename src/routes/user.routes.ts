import { Router } from "express";
import { getUser, createUser } from "../controller/User/user.controller";
import { signOut, deleteUser } from "../services/supabaseClient";
// import prisma from "../services/prismaClient";
// import authenticateToken from "../middlewares/authMiddleware";

const router = Router();

// create new user

router.post("/Signup", createUser);

// get current user

router.get("/Login", getUser);

// Signout User

router.get("/Signout", signOut);

// delete User

router.post("/Delete", deleteUser);

export default router;
