import express from 'express';
import { Login, Signup, Logout, UpdateUserDetails } from '../controllers/auth.js';
import { AuthenticatedUser } from '../middlewares/auth.js';
import passport from 'passport';
import { ConfigureGoogleStrategy, FinalCallGoogle } from '../controllers/google-auth.js';
import { ConfigureGitHubStrategy, FinalCallGitHub } from '../controllers/github-auth.js';


const router = express.Router();


router.post('/signup', Signup )
router.post('/login', Login )
router.post('/logout', Logout )
router.post('/user/update', AuthenticatedUser , UpdateUserDetails )



// LOGIN WITH GOOGLE ROUTES
ConfigureGoogleStrategy();


router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false  }),
   FinalCallGoogle
);



// LOGIN WITH GITHUB ROUTES
ConfigureGitHubStrategy();


router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/', session: false  }),
   FinalCallGitHub
);

export default router;