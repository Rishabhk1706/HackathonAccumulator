import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import collegeRoutes from './routes/collegeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import matchRequestRoutes from './routes/matchRequestRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT

app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=> console.log(`Connected Successfully`))
    .catch(()=> console.error(`Error to Connect`))
    
    app.use("/api/auth", authRoutes);
    app.use("/api/colleges", collegeRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/events", eventRoutes);
    app.use("/api/match-requests", matchRequestRoutes);
    app.use("/api/projects", projectRoutes);

app.get("/", (req, res) => {
  res.send("🎉 Welcome to the College Network!");
});

app.listen(PORT, ()=>console.log(`Server started http://localhost:${PORT}`))



