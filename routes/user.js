import express from 'express';

import { otherSignup, signin, signup,otherSignin } from '../controllers/user.js';

const router = express.Router();
router.post('/signin', signin);
router.post('/signup', signup);
router.post('/othersignup', otherSignup);
router.post('/othersignin',otherSignin)

export default router;