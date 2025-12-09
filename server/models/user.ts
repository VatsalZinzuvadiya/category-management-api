import mongoose, { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

userSchema.index({ email: 1 });

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const { _id, __v, password, ...object } = returnedObject;
    object.id = _id.toString();
    return object;
  },
});

const User = model<IUser>('User', userSchema);

export default User;
