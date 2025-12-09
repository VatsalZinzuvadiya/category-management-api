import Category, { ICategory } from '../models/category';
import logger from '../utils/logger';

const getCategories = async () => {
  try {
    logger.info('Fetching all categories from database');
    const categories = await Category.find();
    logger.info('Successfully fetched all categories');
    return categories;
  } catch (error) {
    logger.error('Error fetching categories:', error);
    throw error;
  }
};

const updateCategory = async (id: string, data: Partial<ICategory>) => {
  try {
    logger.info(`Updating category with id: ${id}`);
    const updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true });
    logger.info('Successfully updated category');
    return updatedCategory;
  } catch (error) {
    logger.error('Error updating category:', error);
    throw error;
  }
};

const deleteCategory = async (id: string) => {
  try {
    logger.info(`Deleting category with id: ${id}`);
    const deletedCategory = await Category.findByIdAndDelete(id);
    logger.info('Successfully deleted category');
    return deletedCategory;
  } catch (error) {
    logger.error('Error deleting category:', error);
    throw error;
  }
};

const createCategory = async (data: Partial<ICategory>) => {
  try {
    logger.info('Creating new category in database');
    const newCategory = new Category(data);
    await newCategory.save();
    logger.info('Successfully created new category');
    return newCategory;
  } catch (error) {
    logger.error('Error creating new category:', error);
    throw error;
  }
};

export default {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
