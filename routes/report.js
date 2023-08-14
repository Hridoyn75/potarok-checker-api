import express from 'express';
import { CreateReport, GetAllReports,
     GetSingleReport, DeleteReport, UpdateReport,
      GetUserReports,
      CreateComment} 
from '../controllers/report.js';
import { AuthenticatedUser } from '../middlewares/auth.js';

const router = express.Router();


router.get('/all', GetAllReports )
router.get('/self', AuthenticatedUser , GetUserReports )
router.get('/:id', GetSingleReport )
router.post('/create', AuthenticatedUser , CreateReport )
router.delete('/delete/:id', AuthenticatedUser , DeleteReport )

// Comments
router.post('/comment/create', AuthenticatedUser , CreateComment )




export default router;