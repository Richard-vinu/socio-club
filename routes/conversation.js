import express from 'express'
import { getConversation, getMyConversations, getConversations, postMessage, createConversation, deleteConversation } from '../controllers/conversation.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getConversations);
router.get('/my', auth, getMyConversations);
router.get('/:id', auth, getConversation);
router.patch('/message/:id', auth, postMessage);
router.post('/conversation', auth, createConversation);
router.delete('/delete/:id', deleteConversation);

export default router;