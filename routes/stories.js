import express from 'express'
import { getStories, getStoryById, getStoryofUsers, postStory, deleteStoryById, viewStory } from '../controllers/stories.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getStories);
router.get('/:id', auth, getStoryById);
router.get('/story/:id', auth, getStoryofUsers);
router.post('/new', auth, postStory);
router.delete('/delete/:id', auth, deleteStoryById);
router.patch('/view/:id', auth, viewStory);

export default router;