import express from 'express';
import multer from 'multer';
import { registerUser, loginUser, getAllUsers, getUser, deleteUser } from '../controllers/userController';
import validateToken from '../middlewares/validateTokenHandler';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: 'src/public', // Make sure this path exists or handle folder creation
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Public routes
router.post('/signup', upload.single('profile_url'), registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/', validateToken, getAllUsers);
router.get('/:id', validateToken, getUser);
router.delete('/:id', validateToken, deleteUser);

export default router;
