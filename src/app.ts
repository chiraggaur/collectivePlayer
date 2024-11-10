import express, { Response } from "express";
import userRoutes from "./routes/user.routes";
import songRoutes from "./routes/protectedRoutes/song.routes";
import queueRoutes from "./routes/protectedRoutes/queue.route";
import * as dotenv from "dotenv";
dotenv.config();

const app = express(); // mounting express app

// inbuilt middleware

app.use(express.json());
// custom middleware / starts with app.use

// handling all routes are also middleware

app.use("/api/user", userRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/queue", queueRoutes);

// handling error routes
app.use("/", (res: Response) => {
  console.log("home page is live ");
  res.status(200).json({ message: "page is live" });
});

export default app;

//adding again to main branch
