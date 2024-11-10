"use strict";
// Note
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.deleteUser = exports.signOut = exports.signUp = exports.signIn = void 0;
/*
Since both clients are interacting with the same database, you should only use one client at a time within specific parts of your code, depending on the feature.
Use Prisma for database-heavy services, like complex joins, relational queries, and type-safe CRUD operations.
Use Supabase for handling authentication, storage, and real-time updates, as well as providing quick REST API access where you don’t need Prisma’s depth.
*/
// supabaseClient.ts
const supabase_js_1 = require("@supabase/supabase-js");
// Environment variables validation
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are missing.");
}
// Create and export the Supabase client
// const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
// Function to handle errors consistently
const handleAuthError = (error) => {
    console.error("Supabase Auth Error:", error.message);
};
// Function to verify the token
const verifyToken = async (token) => {
    try {
        // Decode and verify the token
        const { data, error } = await supabase.auth.getUser(token);
        if (error)
            throw new Error(error.message);
        return data.user; // Return the user object if verification is successful
    }
    catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
};
exports.verifyToken = verifyToken;
// Sign-up function with Supabase
const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        handleAuthError(error);
        return { error };
    }
    return data;
};
exports.signUp = signUp;
// Sign-in function with Supabase
const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        handleAuthError(error);
        return { error };
    }
    return data;
};
exports.signIn = signIn;
// Sign-out user
const signOut = async (req, res) => {
    const signOutResult = await supabase.auth.signOut();
    if (signOutResult.error) {
        console.error("Sign-out error:", signOutResult.error.message);
        res.status(400).json({ message: signOutResult.error.message });
        return;
    }
    res.status(200).json({ message: "Logged out successfully" });
};
exports.signOut = signOut;
// Delete User  Permanently
const deleteUser = async (req, res) => {
    const userId = req.body.userId;
    console.log(userId);
    const { data, error } = await supabase.auth.admin.deleteUser(String(userId));
    if (error) {
        console.error("Sign-out error:", error.message);
        res.status(400).json({ message: error.message });
        return;
    }
    res.status(200).json({ message: "user Deleted Successfully" });
    return;
};
exports.deleteUser = deleteUser;
// Export supabase client and auth methods
exports.default = supabase;
