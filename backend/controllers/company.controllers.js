import { Company } from '../models/company.model.js';

// CREATE COMPANY
export const createCompany = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { name, description, website, location, logo } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Company name is required.' });
    }

    const existing = await Company.findOne({ name });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Company name already exists.' });
    }

    const newCompany = new Company({
      name,
      description,
      website,
      location,
      logo,
      userId
    });

    const saved = await newCompany.save();

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      company: saved
    });
  } catch (err) {
    console.error('Create Company Error:', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// GET ALL COMPANIES BY USER
export const getCompanyByUser = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const companies = await Company.find({ userId });
    res.status(200).json({ success: true, companies });
  } catch (err) {
    console.error('Fetch Company Error:', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// UPDATE COMPANY
export const updateCompany = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const updatedCompany = await Company.findOneAndUpdate(
      { _id: id, userId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }

    res.status(200).json({ success: true, message: 'Company updated', company: updatedCompany });
  } catch (err) {
    console.error('Update Company Error:', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// DELETE COMPANY
export const deleteCompany = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const deleted = await Company.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }

    res.status(200).json({ success: true, message: 'Company deleted successfully' });
  } catch (err) {
    console.error('Delete Company Error:', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
