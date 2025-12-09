import categoryHelper from '../helper/category';
import logger from '../utils/logger';
import { ICategory } from '../models/category';

const getCategories = async () => {
  try {
    logger.info('Category service: Fetching categories');
    const categories = await categoryHelper.getCategories();
    const categoryMap = new Map();
    const categoryTree: any[] = [];

    categories.forEach((category) => {
      categoryMap.set(category._id.toString(), { ...category.toJSON(), children: [] });
    });

    categories.forEach((category) => {
      if (category.parent) {
        const parent = categoryMap.get(category.parent.toString());
        if (parent) {
          parent.children.push(categoryMap.get(category._id.toString()));
        }
      } else {
        categoryTree.push(categoryMap.get(category._id.toString()));
      }
    });

    return categoryTree;
  } catch (error) {
    logger.error('Error in category service while fetching categories:', error);
    throw error;
  }
};

const updateCategory = async (id: string, data: Partial<ICategory>) => {
  try {
    logger.info(`Category service: Updating category with id: ${id}`);
    const updatedCategory = await categoryHelper.updateCategory(id, data);

    if (data.status === 'inactive' && updatedCategory) {
      const allCategories = await categoryHelper.getCategories();
      const categoryMap = new Map();
      allCategories.forEach(category => {
        categoryMap.set(category._id.toString(), category);
      });

      const deactivateChildren = async (parentId: string) => {
        const children = allCategories.filter(category => category.parent?.toString() === parentId);
        for (const child of children) {
          await categoryHelper.updateCategory(child._id.toString(), { status: 'inactive' });
          await deactivateChildren(child._id.toString());
        }
      };

      await deactivateChildren(id);
    }

    return updatedCategory;
  } catch (error) {
    logger.error('Error in category service while updating category:', error);
    throw error;
  }
};

const deleteCategory = async (id: string) => {
  try {
    logger.info(`Category service: Deleting category with id: ${id}`);
    const categoryToDelete = await Category.findById(id);
    if (!categoryToDelete) {
      throw new Error('Category not found');
    }

    const newParent = categoryToDelete.parent;
    await Category.updateMany({ parent: id }, { parent: newParent });

    const deletedCategory = await categoryHelper.deleteCategory(id);
    return deletedCategory;
  } catch (error) {
    logger.error('Error in category service while deleting category:', error);
    throw error;
  }
};

const createCategory = async (data: Partial<ICategory>) => {
  try {
    logger.info('Category service: Creating new category');
    const newCategory = await categoryHelper.createCategory(data);
    return newCategory;
  } catch (error) {
    logger.error('Error in category service while creating new category:', error);
    throw error;
  }
};

import Category from '../models/category';

export default {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
