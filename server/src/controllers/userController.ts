import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, validateUser } from '../models/userModels';
import { config } from '../config/config';

//@desc Register a user
//@route POST /api/users/register
//@access public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body);
    const { error } = validateUser(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { name, email, password } = req.body;
    const profile_url = req.file ? req.file.filename : undefined;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already registered!' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, profile_url });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'An error occurred during registration' });
  }
};

//@desc Get all users
//@route GET /api/users
//@access private
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find()
      .sort({ name: 1 })
      .select('_id name email profile_url createdAt updatedAt');

    const formattedUsers = users.map(user => ({
      ...user.toObject(),
      profile_url: user.profile_url
        ? `${config.SERVER_URL}/src/${user.profile_url}`
        : null
    }));

    res.status(200).json(formattedUsers);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'An error occurred while fetching users' });
  }
};

//@desc Get single user
//@route GET /api/users/:id
//@access public
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }

  try {
    const user = await User.findById(id).select('_id name email profile_url createdAt updatedAt');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const userObj = user.toObject();
    userObj.profile_url = `${process.env.SERVER_URL}/src/${user.profile_url}`;

    res.status(200).json(userObj);
  } catch (error: any) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      res.status(400).json({ message: 'Invalid user ID format' });
      return;
    }
    res.status(500).json({ message: 'An error occurred while fetching the user' });
  }
};

//@desc Login user
//@route POST /api/users/login
//@access public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).json({ message: 'All fields are mandatory!' });
      return;
    }

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          name: user.name,
          email: user.email,
          id: user._id,
          profile_url: `${process.env.SERVER_URL}/src/${user.profile_url}`
        },
        config.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '1d' }
      );

      res.status(200).json({ accessToken });
    } else {
      res.status(401).json({ message: 'Email or Password is not valid' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'An error occurred during login' });
  }
};

//@desc Delete single user
//@route DELETE /api/users/:id
//@access private
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      res.status(400).json({ message: 'Invalid User ID format' });
      return;
    }
    res.status(500).json({ message: 'An error occurred while deleting the user' });
  }
};
