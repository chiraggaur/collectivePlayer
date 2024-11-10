"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const song_routes_1 = __importDefault(require("./routes/protectedRoutes/song.routes"));
const queue_route_1 = __importDefault(require("./routes/protectedRoutes/queue.route"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const app = (0, express_1.default)(); // mounting express app
// inbuilt middleware
app.use(express_1.default.json());
// custom middleware / starts with app.use
// handling all routes are also middleware
app.use("/api/user", user_routes_1.default);
app.use("/api/songs", song_routes_1.default);
app.use("/api/queue", queue_route_1.default);
// handling error routes
app.use("/", (res) => {
    console.log("home page is live ");
    res.status(200).json({ message: "page is live" });
});
exports.default = app;
