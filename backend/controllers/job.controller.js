import Job from '../models/job.model.js';
import { Company } from '../models/company.model.js';

// CREATE A NEW JOB
export const createJob = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const {
      title,
      description,
      requirements = [],
      salary,
      location,
      jobType,
      position,
      companyId
    } = req.body;

    if (!title || !description || !location || !position || !companyId) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: title, description, location, position, companyId'
      });
    }

    const company = await Company.findOne({ _id: companyId });

    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }

    if (company.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: You can only post jobs under your own company'
      });
    }

    const newJob = new Job({
      title,
      description,
      requirements: Array.isArray(requirements) ? requirements : [requirements],
      salary,
      location,
      jobType,
      position,
      company: companyId,
      created_by: userId
    });

    const savedJob = await newJob.save();

    return res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job: savedJob
    });

  } catch (err) {
    console.error('Create Job Error:', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// GET ALL JOBS POSTED BY CURRENT RECRUITER
export const getJobsByUser = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const jobs = await Job.find({ created_by: userId })
      .populate('company', 'name location website')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs
    });
  } catch (err) {
    console.error('Get Jobs Error:', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// UPDATE JOB
export const updateJob = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const job = await Job.findOne({ _id: id, created_by: userId });
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found or unauthorized' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (err) {
    console.error('Update Job Error:', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// DELETE JOB
export const deleteJob = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const job = await Job.findOneAndDelete({ _id: id, created_by: userId });

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found or unauthorized' });
    }

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (err) {
    console.error('Delete Job Error:', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// GET SINGLE JOB (PUBLIC)
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate('company', 'name location website logo')
      .populate('created_by', 'username email');

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    res.status(200).json({
      success: true,
      job
    });
  } catch (err) {
    console.error('Get Job By ID Error:', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// ✅ NEW: GET ALL JOBS (PUBLIC)
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('company', 'name location website logo')
      .populate('created_by', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs
    });
  } catch (err) {
    console.error('Get All Jobs Error:', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
