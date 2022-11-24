import express from 'express';

import auth from '../middleware/auth.js';
import { getProfile } from "../controllers/users.js";
import { addConnection, removeConnection } from '../controllers/connections.js';

const router = express.Router();

router.get('/', auth, getProfile);
router.patch('/connection/add/:id', auth, addConnection);
router.patch('/connection/remove/:id', auth, removeConnection);

export default router;