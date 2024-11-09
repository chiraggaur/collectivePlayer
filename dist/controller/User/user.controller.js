"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.createUser = void 0;
const prismaClient_1 = __importDefault(require("../../services/prismaClient"));
const supabaseClient_1 = require("../../services/supabaseClient");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Utility function to handle errors
const handleError = (res, status, message) => {
    res.status(status).json({ error: message });
};
// Function to create user in Prisma after Supabase sign-up
const createUserInPrisma = async (email, password, name) => {
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    return prismaClient_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });
};
// Sign-up new user and return the token
const createUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // Check if the user already exists
        let user = await prismaClient_1.default.user.findUnique({ where: { email } });
        if (!user) {
            // Attempt to sign up with Supabase
            const signUpResult = await (0, supabaseClient_1.signUp)(email, password);
            if ("error" in signUpResult) {
                // If sign-up failed, return the error message
                return handleError(res, 400, signUpResult.error.message);
            }
            // If Supabase sign-up is successful, create user in Prisma
            user = await createUserInPrisma(email, password, name);
            const token = signUpResult?.session?.access_token;
            res.status(200).json({
                prismaUser: user,
                token, // Send token as part of the response
            });
            return;
        }
        // If user already exists
        return handleError(res, 401, "You are already a registered user. Please sign in!");
    }
    catch (error) {
        console.error("Error in /api/createUser:", error);
        return handleError(res, 500, "An error occurred while signing up the user");
    }
};
exports.createUser = createUser;
// Function to log in user by verifying email and password
const getUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return handleError(res, 401, "Authorization token missing");
        }
        // Attempt to log the user in with Supabase credentials
        const loggedInUserResponse = await (0, supabaseClient_1.signIn)(email, password);
        if ("error" in loggedInUserResponse) {
            return handleError(res, 400, "Wrong Id or password , Error while logging you in .");
        }
        // Return logged-in user's information
        res.status(200).json({ user: loggedInUserResponse.user });
        return;
    }
    catch (error) {
        console.error("Error in /api/getUser:", error);
        return handleError(res, 500, "An error occurred while retrieving the user");
    }
};
exports.getUser = getUser;
