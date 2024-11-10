"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const supabaseClient_1 = require("../services/supabaseClient");
// Middleware to authenticate user based on Supabase token
const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized: Token is missing" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const user = await (0, supabaseClient_1.verifyToken)(token);
        if (!user) {
            res.status(403).json({ error: "Forbidden: Invalid or expired token" });
            return;
        }
        // Attach the user object to the request
        req.body = user;
        next(); // Continue to the next middleware or route handler
    }
    catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.authenticateUser = authenticateUser;
