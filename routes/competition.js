import express from 'express'
import { getCompetitions, getCompetitionById, getCompetitionsOfUsers, createCompetition, deleteCompetitionById, submitEntry, deleteEntry, entryOfUser, likeCompPost, unlikeCompPost, updateCompetition } from '../controllers/competition.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getCompetitions);
router.get('/:id', auth, getCompetitionById);
router.get('/myCompetitions/:id', auth, getCompetitionsOfUsers);

router.post('/new', auth, createCompetition);
router.patch('/edit', auth, updateCompetition);
router.delete('/delete/:id', auth, deleteCompetitionById);

router.patch('/entry', auth, submitEntry);
router.delete('/entry/delete', auth, deleteEntry);
router.get('/myEntries/:competitionId', auth, entryOfUser);

router.patch('/like/:id', auth, likeCompPost);
router.patch('/unlike/:id', auth, unlikeCompPost);

export default router;