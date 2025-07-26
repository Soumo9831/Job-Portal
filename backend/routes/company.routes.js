import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import {
  createCompany,
  getCompanyByUser,
  getAllCompanies,     // ✅ Import added
  updateCompany,
  deleteCompany
} from '../controllers/company.controllers.js';

const companyRoutes = express.Router();

// CREATE company (protected)
companyRoutes.post('/', verifyToken, createCompany);

// GET all companies by the logged-in user (protected)
companyRoutes.get('/', verifyToken, getCompanyByUser);

// ✅ NEW: GET all companies (public or protect if needed)
companyRoutes.get('/all', getAllCompanies);

// UPDATE company by ID (protected)
companyRoutes.put('/:id', verifyToken, updateCompany);

// DELETE company by ID (protected)
companyRoutes.delete('/:id', verifyToken, deleteCompany);

export default companyRoutes;
