import categoryService from '../../server/service/category';
import categoryHelper from '../../server/helper/category';

// Mock the categoryHelper to isolate the service from the database
jest.mock('../../server/helper/category');

describe('Category Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategories', () => {
    it('should correctly build a category tree', async () => {
      const mockCategories = [
        { _id: '1', name: 'Root', toJSON: () => ({ _id: '1', name: 'Root' }) },
        { _id: '2', name: 'Child1', parent: '1', toJSON: () => ({ _id: '2', name: 'Child1', parent: '1' }) },
        { _id: '3', name: 'Child2', parent: '1', toJSON: () => ({ _id: '3', name: 'Child2', parent: '1' }) },
      ];
      (categoryHelper.getCategories as jest.Mock).mockResolvedValue(mockCategories);

      const tree = await categoryService.getCategories();

      expect(tree).toHaveLength(1);
      expect(tree[0].name).toBe('Root');
      expect(tree[0].children).toHaveLength(2);
    });
  });

  describe('updateCategory', () => {
    it('should deactivate children when a parent is deactivated', async () => {
      const mockCategories = [
        { _id: '1', name: 'Root' },
        { _id: '2', name: 'Child1', parent: '1' },
        { _id: '3', name: 'Grandchild1', parent: '2' },
      ];
      (categoryHelper.getCategories as jest.Mock).mockResolvedValue(mockCategories);
      (categoryHelper.updateCategory as jest.Mock).mockImplementation((id, data) => Promise.resolve({ _id: id, ...data }));

      await categoryService.updateCategory('1', { status: 'inactive' });

      // Expect updateCategory to be called for the parent and all its children
      expect(categoryHelper.updateCategory).toHaveBeenCalledWith('1', { status: 'inactive' });
      expect(categoryHelper.updateCategory).toHaveBeenCalledWith('2', { status: 'inactive' });
      expect(categoryHelper.updateCategory).toHaveBeenCalledWith('3', { status: 'inactive' });
    });
  });
});
