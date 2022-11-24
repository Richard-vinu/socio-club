import express from 'express'
import { getCompetitions, getCompetitionById, createCompetition, deleteCompetitionById, likeCompPost, unlikeCompPost, updateCompetition } from '../controllers/competition.js';
import { getCompetitionsbyUpvotes, featureCompetition, ranks, adminStory, getAdminCompetitions } from '../controllers/admin.js';
import { postStory } from '../controllers/stories.js';
import { getProfile } from "../controllers/users.js";
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getProfile);
router.get('/competitionsByDate', auth, getCompetitions);
router.get('/competitionsById/:id', auth, getCompetitionById);
router.get('/adminCompetitions', auth, getAdminCompetitions);

router.post('/newComp', auth, createCompetition);
router.patch('/editComp', auth, updateCompetition);

router.delete('/delete/:id', auth, deleteCompetitionById);

router.get('/popularCompetitions', auth, getCompetitionsbyUpvotes);
router.patch('/featureCompetition/:id', auth, featureCompetition);
router.get('/ranking/:id', auth, ranks);
router.get('/story/:id', auth, adminStory);
router.post('/newStory', auth, postStory);


export default router;