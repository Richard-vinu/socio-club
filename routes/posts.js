import express from 'express';
import { createAnonymousPost, getAnonymousPosts, unlikePost, unlikeComment, getPostComments, getPostofUsers, likeComment, likePost, deletePostById, deleteCommentById, getPosts, getComments, getPostById, getCommentById, createPost, createComment, updateComment, updatePost } from '../controllers/posts.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getPosts);
router.get('/:id', auth, getPostById);

router.get('/comments', auth, getComments);
router.get('/comment/:id', auth, getCommentById);

router.get('/post/comments/:id', auth, getPostComments);
router.get('/post/:id', auth, getPostofUsers);

router.post('/new', auth, createPost);
router.post('/comment/new', auth, createComment);

router.patch('/edit', auth, updatePost);
router.patch('/comment/edit', auth, updateComment);

router.delete('/delete/:id', auth, deletePostById);
router.delete('/comment/delete/:id', auth, deleteCommentById);

router.patch('/like/:id', auth, likePost);
router.patch('/comment/like/:id', auth, likeComment);

router.patch('/unlike/:id', auth, unlikePost);
router.patch('/comment/unlike/:id', auth, unlikeComment);

router.post('/new/anonymous', auth, createAnonymousPost);
router.get('/anonymous/all', auth, getAnonymousPosts);

export default router;