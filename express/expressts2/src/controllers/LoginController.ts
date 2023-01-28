import { Request, Response } from "express";
import { get, controller, post, bodyValidator } from "./decorators";

// function logger(req: Request, res: Response, next: NextFunction){
//   console.log('Request was made!!');
//   next();
// }

@controller("/auth")
class LoginController {
  // if we dun define the descriptor in routes decorator, this function will crash the browser
  // @get("/")
  // add(a: number, b: number) {
  //   return a + b;
  // }

  @get("/login")
  // @use(logger)
  getLogin(req: Request, res: Response): void {
    res.send(`
      <form method="POST">
        <div>
          <label>Email</label>
          <input name="email" />
        </div>
        <div>
          <label>Password</label>
          <input name="password" type="password" />
        </div>
        <button>Submit</button>
      </form>
    `);
  }

  @post("/login")
  @bodyValidator("email", "password")
  postLogin(req: Request, res: Response) {
    const { email, password } = req.body;

    if (email === "a@a.com" && password === "password") {
      req.session = { loggedIn: true };
      res.redirect("/");
    } else {
      res.send("Invalid email or password");
    }
  }

  @get("/logout")
  getLogout(req: Request, res: Response) {
    req.session = undefined;
    res.redirect("/");
  }
}
