import { RequestHandler } from 'express';

import { Todo } from '../models/todo';

// this could be database connection
const TODOS: Todo[] = [];

// shortcut: instead of defining types of arguments, just use RequestHandler type from @types/express
export const createTodo: RequestHandler = (req, res, next) => {
  
  // typecast to get proper IDE support
  const text = (req.body as {text: string}).text;
  const newTodo = new Todo(Math.random().toString(), text);

  TODOS.push(newTodo);

  // return a response
  res.status(201).json({message: 'Created the todo.', createdTodo: newTodo});
};