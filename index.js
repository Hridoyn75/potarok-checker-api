import express from 'express';
import authRoutes from './routes/auth.js';
import reportRoutes from './routes/report.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config(); // Load variables from .env into process.env


const app = express();
const port = process.env.PORT;


// MIDDLEWARES  
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [ process.env.FRONTEND_URL ],
    credentials: true, // Allow credentials (cookies)
  }));

// ROUTES
app.get("/", (req, res) => {
    res.json("Our Server is live!");
})
app.use("/", authRoutes)
app.use("/report", reportRoutes)






app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});