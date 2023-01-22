import { Router } from 'express';

import { createTodo, getTodos, updateTodo, deleteTodo } from '../controllers/todos';

const router = Router();

// add todos
router.post('/', createTodo);

// get all todos
router.get('/', getTodos);

// update todos
router.patch('/:id', updateTodo);

// delete todos
router.delete('/:id', deleteTodo);

export default router;