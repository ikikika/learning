export class AppError extends Error {
  statusCode: string | number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number | string) {
    super(message); // call parent constructor, in this case, its passign the mnessage to the message property of the parent class

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
