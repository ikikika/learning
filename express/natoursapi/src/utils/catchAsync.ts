import { Request, Response, NextFunction } from "express";

type FnProps = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const catchAsync = (fn: FnProps) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // this `next` function will trigger our global errror handling middleware
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;

// encapsulate entire async function in catchAsync, therefore argument of catchAsync is a function, fn
// arguments of fn is the same as arguments of original async function
// when promise gets rejected, fn will return error
// we can catch the error by calling the .catch function of the promise, instead of using try catch block

// but what we want is wahts returned by fn, not whats returned by catchAsync
// therefore we need to make catchAsync call the function fn and return its results
// in order for function fn to be called by the return statement, we need to state the arguments taking in by fn
