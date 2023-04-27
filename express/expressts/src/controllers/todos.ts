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

export const getTodos: RequestHandler = (req, res, next) => {
  res.json({ todos: TODOS });
};

export const updateTodo: RequestHandler<{ id: string }> = (req, res, next) => {
  const todoId = req.params.id;

  const updatedText = (req.body as { text: string }).text;

  const todoIndex = TODOS.findIndex(todo => todo.id === todoId);

  if (todoIndex < 0) {
    throw new Error('Could not find todo!');
  }

  TODOS[todoIndex] = new Todo(TODOS[todoIndex].id, updatedText);

  res.json({ message: 'Updated!', updatedTodo: TODOS[todoIndex] });
};

export const deleteTodo: RequestHandler = (req, res, next) => {
  const todoId = req.params.id;

  const todoIndex = TODOS.findIndex(todo => todo.id === todoId);

  if (todoIndex < 0) {
    throw new Error('Could not find todo!');
  }

  TODOS.splice(todoIndex, 1);

  res.json({ message: 'Todo deleted!' });
};