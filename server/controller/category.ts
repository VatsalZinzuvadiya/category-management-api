import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import categoryService from '../service/category';
import logger from '../utils/logger';
import { sendSuccess, sendError } from '../utils/response';

const createCategory = async (req: Request, res: Response) => {
  const { body } = req;
  try {
    logger.info('Received request to create new category', { body });
    const newCategory = await categoryService.createCategory(body);
    logger.info('Successfully created new category');
    sendSuccess(res, 'Category created successfully', newCategory, StatusCodes.CREATED);
  } catch (error: any) {
    logger.error('Error in category controller while creating new category:', { error });
    sendError(res, 'Error creating category');
  }
};

const getCategories = async (req: Request, res: Response) => {
  try {
    logger.info('Received request to get category tree');
    const categoryTree = await categoryService.getCategories();
    logger.info('Successfully fetched category tree');
    sendSuccess(res, 'Categories fetched successfully', categoryTree);
  } catch (error: any) {
    logger.error('Error in category controller while fetching category tree:', { error });
    sendError(res, 'Error fetching categories');
  }
};

const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    logger.info(`Received request to update category with id: ${id}`, { body });
    const updatedCategory = await categoryService.updateCategory(id, body);
    logger.info('Successfully updated category');
    sendSuccess(res, 'Category updated successfully', updatedCategory);
  } catch (error: any) {
    logger.error('Error in category controller while updating category:', { error });
    sendError(res, 'Error updating category');
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    logger.info(`Received request to delete category with id: ${id}`);
    await categoryService.deleteCategory(id);
    logger.info('Successfully deleted category');
    sendSuccess(res, `Category with id ${id} deleted successfully`, null, StatusCodes.OK);
  } catch (error: any) {
    logger.error('Error in category controller while deleting category:', { error });
    sendError(res, 'Error deleting category');
  }
};

export {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
