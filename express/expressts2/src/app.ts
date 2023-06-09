import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { AppRouter } from './AppRouter';
import './controllers/LoginController';
import './controllers/RootController'

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ['laskdjf'] }));
app.use(AppRouter.getInstance());

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

// Refactor into a more TS class syntax
// Possible but not necessarily beneficial
/*
class Server {
  app: express.Express = express();

  constructor() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieSession({ keys: ["laskdjf"] }));
    this.app.use(router);
  }

  start(): void{
    this.app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
  }
}

new Server().start();
*/
