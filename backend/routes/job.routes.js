import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import {
  createJob,
  getJobsByUser,
  updateJob,
  deleteJob,
  getJobById,
  getAllJobs
} from '../controllers/job.controller.js';

const jobRouter = express.Router();

jobRouter.post('/', verifyToken, createJob);             // POST a new job (recruiter)
jobRouter.get('/my-jobs', verifyToken, getJobsByUser);   // GET all jobs by current recruiter
jobRouter.get('/', getAllJobs);                          // GET all jobs (public)
jobRouter.get('/:id', getJobById);                       // GET job by ID (public)
jobRouter.put('/:id', verifyToken, updateJob);           // UPDATE job by ID (recruiter)
jobRouter.delete('/:id', verifyToken, deleteJob);        // DELETE job by ID (recruiter)

export default jobRouter;
