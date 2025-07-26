import { Application } from '../models/application.model.js';
import Job from '../models/job.model.js';
import User from '../models/user.model.js'; // ✅ CORRECT


// APPLY TO A JOB
export const applyToJob = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, error: 'Job ID is required' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Prevent duplicate applications
    const existing = await Application.findOne({ job: jobId, applicant: userId });
    if (existing) {
      return res.status(409).json({ success: false, error: 'You have already applied for this job' });
    }

    const newApp = new Application({
      job: jobId,
      applicant: userId
    });

    await newApp.save();

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application: newApp
    });
  } catch (err) {
    console.error('Apply Error:', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// GET APPLICATIONS BY JOB (RECRUITER)
export const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'username email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications
    });
  } catch (err) {
    console.error('Get Applications Error:', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// GET JOBS APPLIED BY CURRENT USER (CANDIDATE)
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const applications = await Application.find({ applicant: userId })
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications
    });
  } catch (err) {
    console.error('My Applications Error:', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// UPDATE APPLICATION STATUS (RECRUITER)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    }

    const updated = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Application status updated',
      application: updated
    });
  } catch (err) {
    console.error('Update Status Error:', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
