export class AppError extends Error {
  statusCode: string | number;
  status: string;
  isOperational: boolean;
  path?: string;
  value?: string;

  constructor(message: string, statusCode: number | string, err?: any) {
    super(message); // call parent constructor, in this case, its passign the mnessage to the message property of the parent class

    this.message = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    if (err) {
      this.name = err.name;
      this.path = err.path;
      this.value = err.value;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}
