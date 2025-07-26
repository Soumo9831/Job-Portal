import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import {
  createCompany,
  getCompanyByUser,
  updateCompany,
  deleteCompany
} from '../controllers/company.controllers.js';

const companyRoutes = express.Router();

companyRoutes.post('/', verifyToken, createCompany); // Create
companyRoutes.get('/', verifyToken, getCompanyByUser); // Read
companyRoutes.put('/:id', verifyToken, updateCompany); // Update
companyRoutes.delete('/:id', verifyToken, deleteCompany); // Delete

export default companyRoutes;
