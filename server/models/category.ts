import mongoose, { Document, Schema, model, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  parent: Types.ObjectId | null;
  status: 'active' | 'inactive';
}

const categorySchema: Schema<ICategory> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, { timestamps: true });

categorySchema.index({ parent: 1 });

categorySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const { _id, __v, ...object } = returnedObject;
    object.id = _id.toString();
    return object;
  },
});

const Category = model<ICategory>('Category', categorySchema);

export default Category;
