import express from 'express';
import { Login, Signup, Logout, UpdateUserDetails } from '../controllers/auth.js';
import { AuthenticatedUser } from '../middlewares/auth.js';
const router = express.Router();


router.post('/signup', Signup )
router.post('/login', Login )
router.post('/logout', Logout )
router.post('/user/update', AuthenticatedUser , UpdateUserDetails )



export default router;