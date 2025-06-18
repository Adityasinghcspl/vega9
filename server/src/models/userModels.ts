import mongoose, { Schema, Document } from 'mongoose';
import Joi from 'joi';
import { UserInput } from '../types/userTypes';

export interface IUser extends Document, UserInput {
  profile_url: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    profile_url: {
      type: String,
      default: '', // default to empty string if no image is uploaded
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model<IUser>('User', userSchema);

// Joi validation schema
const validateUser = (data: UserInput) => {
  const schema = Joi.object<UserInput>({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    profile_url: Joi.string().optional(),
  });

  return schema.validate(data);
};

export { User, validateUser };
