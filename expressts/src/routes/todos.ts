import { Router } from 'express';

const router = Router();

// add todos
router.post('/');

// get all todos
router.get('/');

// update todos
router.patch('/:id');

// delete todos
router.delete('/:id');

export default router;