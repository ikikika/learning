import { Router } from 'express';

import { createTodo } from '../controllers/todos';

const router = Router();

// add todos
router.post('/', createTodo);

// get all todos
router.get('/');

// update todos
router.patch('/:id');

// delete todos
router.delete('/:id');

export default router;