import express from 'express';
import {
  applyToJob,
  getApplicationsByJob,
  getMyApplications,
  updateApplicationStatus
} from '../controllers/application.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const applicationRouter = express.Router();

// Apply to a job (Candidate)
applicationRouter.post('/apply', verifyToken, applyToJob);

// Get all applications for a specific job (Recruiter)
applicationRouter.get('/job/:jobId', verifyToken, getApplicationsByJob);

// Get all applications submitted by current user (Candidate)
applicationRouter.get('/my-applications', verifyToken, getMyApplications);

// Update application status (Recruiter)
applicationRouter.put('/:id/status', verifyToken, updateApplicationStatus);

export default applicationRouter;
