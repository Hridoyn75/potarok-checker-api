import express from 'express';
import authRoutes from './routes/auth.js';
import reportRoutes from './routes/report.js';
import cookieParser from 'cookie-parser';
import { AuthenticatedUser } from './middlewares/auth.js';
import cors from 'cors';

const app = express();
const port = 5000;


// MIDDLEWARES  
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
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