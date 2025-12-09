import express, { Router } from 'express';
import Joi from 'joi';
import { createValidator } from 'express-joi-validation';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from '../controller/category';

const router: Router = express.Router();
const validator = createValidator({});

const createCategoryBody = Joi.object({
  name: Joi.string().required(),
  parent: Joi.string().allow(null, ''),
  status: Joi.string().valid('active', 'inactive'),
});

const updateCategoryBody = Joi.object({
  name: Joi.string(),
  parent: Joi.string().allow(null, ''),
  status: Joi.string().valid('active', 'inactive'),
});

const categoryIdParams = Joi.object({
  id: Joi.string().required(),
});

router.post('/', validator.body(createCategoryBody), createCategory);
router.get('/', getCategories);
router.put('/:id', validator.params(categoryIdParams), validator.body(updateCategoryBody), updateCategory);
router.delete('/:id', validator.params(categoryIdParams), deleteCategory);

export default router;
