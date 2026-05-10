import express from "express";
import authMiddleware from "./authMw.js"
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes)
app.get("/", (req, res) => {
  res.send("Backend running");
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get("/dashboard",authMiddleware,(req,res)=>{
res.json("Welcome to dashboard")
})
