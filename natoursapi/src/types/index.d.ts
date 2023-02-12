export {};

declare global {
  namespace Express {
    interface Request {
      find: (input: object) => void;
    }
  }
}
