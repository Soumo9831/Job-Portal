import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config.js';

import router from './routes/user.routes.js';
import companyRoutes from './routes/company.routes.js';
import jobRouter from './routes/job.routes.js';
import applicationRoutes from './routes/application.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// ✅ Request Logger (for debugging)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ API Routes
app.use('/api/users', router);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRouter);
app.use('/api/applications', applicationRoutes);

// ✅ Test & Default Routes
app.get('/test', (req, res) => {
  res.json({ success: true, message: 'Test route working!' });
});

app.get('/', (req, res) => {
  res.send('🌿 MongoDB Atlas connected. Backend is running!');
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
